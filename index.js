const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const success = (res, payload) => {
  const { matchedCount, modifiedCount } = res;

  console.log('#### success ::: matchedCount / modifiedCount : ', matchedCount, modifiedCount);

  res.json(payload);
  res.status(200);
};

const error = (res, error) => {
  const { matchedCount, modifiedCount } = res;

  console.log('#### error ::: matchedCount / modifiedCount : ', matchedCount, modifiedCount);
  console.log('#### query response -> ', res);
  console.log('#### error -> ', error);
  res.status(500);
};

const logErrorConnecting = (err, client) => {
  console.log('#### error connecting to db', err, client);
  console.log('#### error -> ', err);
  console.log('#### client -> ', client);
};

const buildMongoUri = (username, password) =>
  `mongodb+srv://${username}:${password}@cluster0.v48nx.mongodb.net/smil32-db?retryWrites=true&w=majority`;

const app = express();
const port = 3000;
const corsOptions = { origin: false };

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

  MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    console.log('#### connected ');

    success(response);

    const db = client && client.db('smil32-db');

    if (db) {
      const clientsCollection = db.collection('clients');

      app.get('/clients', (req, res) => {
        clientsCollection
          .find()
          .sort({ name: 1, surname: 1 })
          .toArray()
          .then((results) => success(res, results))
          .catch((err) => error(err));
      });

      app.post('/client', (req, res) => {
        clientsCollection
          .insertOne(req.body)
          .then((results) => success(res, results))
          .catch((err) => error(err));
      });

      app.delete('/client', (req, res) => {
        clientsCollection
          .deleteOne({ _id: ObjectId(req.body.clientId) })
          .then((results) => success(res, results))
          .catch((err) => error(err));
      });

      app.get('/appointments', (req, res) => {
        clientsCollection
          .aggregate([
            { $unwind: '$appointments' },
            { $sort: { 'appointments.date': 1 } },
            { $project: { appointment: '$appointments', name: 1, surname: 1 } }
          ])
          .toArray()
          .then((results) => success(res, results))
          .catch((err) => error(err));
      });

      app.post('/appointment', (req, res) => {
        const { client, appointment, control, date, price, technician, treatment } = req.body;
        const query = { _id: ObjectId(client) };
        const update = {
          $push: {
            appointments: {
              appointment,
              control,
              date,
              price,
              technician,
              treatment
            }
          }
        };

        clientsCollection
          .updateOne(query, update)
          .then((results) => success(res, results))
          .catch((err) => error(err));
      });

      app.put('/appointment/:id', (req, res) => {
        const { appointment, control, date, price, technician, treatment } = req.body;
        const { id } = req.params;
        const query = { 'appointments.date': id };
        const options = { arrayFilters: [{ 'element.date': id }] };
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
          .then((results) => success(res, results))
          .catch((err) => error(err));
      });

      app.delete('/appointment/:date', (req, res) => {
        const { date } = req.params;
        const query = { 'appointments.date': date };
        const update = { $pull: { appointments: { date } } };

        clientsCollection
          .updateOne(query, update)
          .then((results) => success(res, results))
          .catch((err) => error(err));
      });
    } else {
      logErrorConnecting(err, client);
    }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
