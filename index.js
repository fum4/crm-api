import { buildMongoUri, successHandler, errorHandler, generateId, logErrorConnecting } from './utils';
import setupAppMiddleware from './src/middleware/app';

const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;

const username = 'fum4';
const password = '1b2duj35';

// mongoose.connect(buildMongoUri({ username, password }), {useNewUrlParser: true, useUnifiedTopology: true});

setupAppMiddleware(app);

app.post('/auth', (request, response) => {
  const { username, password } = request.body;
  const mongoUri = buildMongoUri(username, password);

  MongoClient.connect(
    mongoUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error, clientResponse) => {
      console.log('#### connected ');

      successHandler(response);

      const db = clientResponse?.db('smil32-db');

      if (db) {
        const clientsCollection = db.collection('clients');

        app.get('/status', (req, res) => {
          if (db.serverConfig.isConnected()) {
            successHandler(res);
          }
        });

        app.post('/disconnect', (req, res) => {
          clientResponse.close().then(() => {
            successHandler(res);
          });
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

            // const query = { _id: ObjectId(client) };
            // const update = {
            //   $push: {
            //     appointments: {
            //       _id: generateId(),
            //       appointment,
            //       control,
            //       date,
            //       price,
            //       technician,
            //       treatment
            //     }
            //   }
            // };
          }

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
