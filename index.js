import express from 'express';
import 'dotenv/config';
import setupAppMiddleware from './src/middleware/app';
import models, { connectDb } from './src/models';
import { ObjectId } from 'bson';
import { successHandler, errorHandler, generateId, logErrorConnecting } from './utils';
const app = express();
const port = process.env.PORT;

setupAppMiddleware(app);

connectDb().then(async () => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  app.post('/auth', (request, response) => {
    successHandler(response);
  });
  app.get('/status', (req, res) => {
    // if (db.serverConfig.isConnected()) {
    successHandler(res);
    // }
  });


  // merge
  app.get('/clients', (req, res) => {
    models.Client.collection
      .find()
      .sort({ name: 1, surname: 1 })
      .toArray()
      .then((results) => successHandler(res, results))
      .catch((err) => errorHandler(err));
  });


  //nu merge, nu baga programare, dar clientul il baga
  app.post('/client', (req, res) => {
    console.log('/client body', req.body);
    const { name, surname, phone, address } = req.body;
    const { appointment, control, date, price, technician, treatment } = req.body;

    // models.Client.collection
    //   .insertOne(req.body)
    //   .then((results) => successHandler(res, results))
    //   .catch((err) => errorHandler(err));
  });


  //neverificat
  app.delete('/client', (req, res) => {
    models.Client.collection
      .deleteOne({ _id: ObjectId(req.body.clientId) })
      .then((results) => successHandler(res, results))
      .catch((err) => errorHandler(err));
  });


  //merge
  app.get('/appointments', (req, res) => {
    models.Client.collection
      .aggregate([
        { $unwind: '$appointments' },
        { $sort: { 'appointments.date': 1 } },
        { $project: { appointment: '$appointments', name: 1, surname: 1 } }
      ])
      .toArray()
      .then((results) => successHandler(res, results))
      .catch((err) => errorHandler(err));
  });


  //// merge doar fara ID
  app.post('/appointment/:clientId?', (req, res) => {
    const { appointment, control, date, price, technician, treatment } = req.body;
    const clientId = req.params && req.params.clientId;

    if (clientId) {
      const query = { _id: ObjectId(clientId) };
      const update = {
        $push: {
          appointments: {
            _id: ObjectId(generateId()),
            appointment,
            control,
            date,
            price,
            technician,
            treatment
          }
        }
      };

      return models.Client.collection
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

    return models.Client.collection
      .insertOne(clientWithAppointment)
      .then((results) => successHandler(res, results))
      .catch((err) => errorHandler(err));
  });


  // nu merge
  app.put('/appointment/', (req, res) => {
    const { appointment, control, date, price, technician, treatment } = req.body;
    const { id } = ObjectId(req.params);
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

    models.Client.collection
      .updateOne(query, update, options)
      .then((results) => successHandler(res, results))
      .catch((err) => errorHandler(err));
  });


  // nu merge
  app.delete('/appointment/:id', (req, res) => {
    const { id } = ObjectId(req.params);
    const query = { 'appointments._id': id };
    const update = { $pull: { appointments: { _id: id } } };

    models.Client.collection
      .updateOne(query, update)
      .then((results) => successHandler(res, results))
      .catch((err) => errorHandler(err));
  });
});
