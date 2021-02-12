import express, { urlencoded, json } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import 'dotenv/config';

const generateId = () => (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();

const successHandler = (res, payload) => {
  res.json(payload);
  res.status(200);
};

const errorHandler = (res, err) => {
  console.log('#### query response -> ', res);
  console.log('#### error -> ', err);
  res.status(500);
};

const logConnectingError = (err, client) => {
  console.log('#### error connecting to db', err, client);
  console.log('#### error -> ', err);
  console.log('#### client -> ', client);
};

const buildMongoUri = (username, password) =>
  `mongodb+srv://${username}:${password}@cluster0.v48nx.mongodb.net/smil32-db?retryWrites=true&w=majority`;

const app = express();
const port = process.env.PORT;
const corsOptions = { origin: false };

app.use(cors(corsOptions));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.post('/auth', (request, response) => {
  const { username, password } = request.body;
  const mongoUri = buildMongoUri(username, password);

  MongoClient.connect(
    mongoUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error, clientResponse) => {
      console.log('#### connected ');

      successHandler(response);

      const db = clientResponse && clientResponse.db('smil32-db');

      if (db) {
        const clientsCollection = db.collection('clients');

        app.get('/status', (req, res) => {
          if (db.serverConfig.isConnected()) {
            successHandler(res);
          }
        });

        app.get('/clients', (req, res) => {
          clientsCollection
            .find()
            .sort({ name: 1, surname: 1 })
            .toArray()
            .then((results) => successHandler(res, results))
            .catch((err) => errorHandler(err));
        });

        app.post('/client', (req, res) => {
          clientsCollection
            .insertOne(req.body)
            .then((results) => successHandler(res, results))
            .catch((err) => errorHandler(err));
        });

        app.delete('/client', (req, res) => {
          clientsCollection
            .deleteOne({ _id: ObjectId(req.body.clientId) })
            .then((results) => successHandler(res, results))
            .catch((err) => errorHandler(err));
        });

        app.get('/appointments', (req, res) => {
          clientsCollection
            .aggregate([
              { $unwind: '$appointments' },
              { $sort: { 'appointments.date': 1 } },
              { $project: { appointment: '$appointments', name: 1, surname: 1 } }
            ])
            .toArray()
            .then((results) => successHandler(res, results))
            .catch((err) => errorHandler(err));
        });

        app.post('/appointment/:clientId?', (req, res) => {
          const { appointment, control, date, price, technician, treatment } = req.body;
          const clientId = req.params && req.params.clientId;

          if (clientId) {
            const query = { _id: ObjectId(clientId) };
            const update = {
              $push: {
                appointments: {
                  _id: generateId(),
                  appointment,
                  control,
                  date,
                  price,
                  technician,
                  treatment
                }
              }
            };

            return clientsCollection
              .updateOne(query, update)
              .then((results) => successHandler(res, results))
              .catch((err) => errorHandler(err));
          }

          const { name, surname, phone, address } = req.body;
          const clientWithAppointment = {
            name,
            surname,
            phone,
            address,
            appointments: [
              {
                appointment,
                control,
                date,
                price,
                technician,
                treatment
              }
            ]
          };

          return clientsCollection
            .insertOne(clientWithAppointment)
            .then((results) => successHandler(res, results))
            .catch((err) => errorHandler(err));
        });

        app.put('/appointment/', (req, res) => {
          const { appointment, control, date, price, technician, treatment } = req.body;
          const { id } = req.params;
          const query = { 'appointments._id': id };
          const options = { arrayFilters: [{ 'element._id': id }] };
          const update = {
            $set: {
              'appointments.$[element].appointment': appointment,
              'appointments.$[element].control': control,
              'appointments.$[element].date': date,
              'appointments.$[element].price': price,
              'appointments.$[element].technician': technician,
              'appointments.$[element].treatment': treatment
            }
          };

          clientsCollection
            .updateOne(query, update, options)
            .then((results) => successHandler(res, results))
            .catch((err) => errorHandler(err));
        });

        app.delete('/appointment/:id', (req, res) => {
          const { id } = req.params;
          const query = { 'appointments._id': id };
          const update = { $pull: { appointments: { _id: id } } };

          clientsCollection
            .updateOne(query, update)
            .then((results) => successHandler(res, results))
            .catch((err) => errorHandler(err));
        });
      } else {
        logConnectingError(error, clientResponse);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
