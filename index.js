import express from 'express';
import 'dotenv/config';
import setupAppMiddleware from './src/middleware/app';
import models, { connectDb } from './src/models';
import { ObjectId } from 'bson';
import { buildMongoUri, successHandler, errorHandler, generateId, logErrorConnecting } from './utils';
const app = express();
const port = process.env.PORT;

setupAppMiddleware(app);

connectDb().then(async () => {
  // const mongooseTest = async () => {
  //   const clientTest = new models.Client({
  //     _id: ObjectId(),
  //     name: 'MongooseTest',
  //     surname: 'MongooseTest Prenume',
  //     phone: '07328382838'
  //   });
  //   await clientTest.save();
  // };
  // mongooseTest();
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  app.post('/auth', (request, response) => {
    successHandler(response);
  });
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
});
