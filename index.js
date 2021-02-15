import express from 'express';
import 'dotenv/config';
import setupAppMiddleware from './src/middleware/app';
import db from './src/models';
import { ObjectId } from 'bson';
import { successHandler, errorHandler, generateId, logErrorConnecting } from './utils';

const app = express();
const port = process.env.PORT;

setupAppMiddleware(app);

db.connect().then(() => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));

  app.post('/auth', (request, response) => {
    successHandler(response);
  });

  app.get('/status', (req, res) => {
    successHandler(res);
  });

  app.get('/clients', (req, res) => {
    db.models.Client.collection
      .find()
      .sort({ name: 1, surname: 1 })
      .toArray()
      .then((results) => successHandler(res, results))
      .catch((err) => errorHandler(err));
  });

  app.post('/client', (req, res) => {
    const { name, surname, phone, address } = req.body;
    const { appointment, control, date, price, technician, treatment } = req.body;

    const newAppointment = new db.models.Appointment({
      appointment,
      control,
      date,
      price,
      technician,
      treatment
    });

    newAppointment.validate((err) => {
      const appointments = [newAppointment];
      const newClient = {
        name,
        surname,
        phone,
        address,
        appointments
      };

      if (err) {
        delete newClient.appointments;
      }

      db.models.Client.create(newClient)
        .then(() => successHandler(res))
        .catch((err) => errorHandler(err));
    });
  });

  app.delete('/client', (req, res) => {
    db.models.Client.collection
      .deleteOne({ _id: ObjectId(req.body.clientId) })
      .then((results) => successHandler(res, results))
      .catch((err) => errorHandler(err));
  });

  app.get('/appointments', (req, res) => {
    db.models.Client.collection
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
    const { name, surname, phone, address } = req.body;
    const { appointment, control, date, price, technician, treatment } = req.body;
    const clientId = req.params && req.params.clientId;

    const newAppointment = new db.models.Appointment({
      appointment,
      control,
      date,
      price,
      technician,
      treatment
    });

    newAppointment.validate((err) => {
      if (err) {
        errorHandler(err);
      } else {
        if (clientId) {
          const query = { _id: ObjectId(clientId) };
          const update = { $push: { appointments: newAppointment } };

          return db.models.Client.collection
            .updateOne(query, update)
            .then((results) => successHandler(res, results))
            .catch((err) => errorHandler(err));
        }

        const appointments = [newAppointment];
        const newClient = {
          name,
          surname,
          phone,
          address,
          appointments
        };

        db.models.Client.create(newClient)
          .then(() => successHandler(res))
          .catch((err) => errorHandler(err));
      }
    });
  });

  app.put('/appointment/:id', (req, res) => {
    const { appointment, control, date, price, technician, treatment } = req.body;
    const id = ObjectId(req.params.id);
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

    db.models.Client.collection
      .updateOne(query, update, options)
      .then((results) => successHandler(res, results))
      .catch((err) => errorHandler(err));
  });

  app.delete('/appointment/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    const query = { 'appointments._id': id };
    const update = { $pull: { appointments: { _id: id } } };

    db.models.Client.collection
      .updateOne(query, update)
      .then((results) => successHandler(res, results))
      .catch((err) => errorHandler(err));
  });
});
