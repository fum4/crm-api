import db from '../models';
import { ObjectId } from 'bson';

const Client = db.models.Client;
const Appointment = db.models.Appointment;

const getClients = (req, res) => {
  return Client.collection
    .find()
    .sort({ name: 1, surname: 1 })
    .toArray()
    .then((results) => res.status(200).json(results))
    .catch((err) => res.status(500).json(err));
};

const addClient = (req, res) => {
  const { name, surname, phone, address } = req.body;
  const { appointment, control, price, technician, treatment } = req.body;

  const newAppointment = new Appointment({
    appointment,
    control,
    price,
    technician,
    treatment
  });

  return newAppointment.validate((err) => {
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

    return Client.create(newClient)
      .then((results) => res.status(201).json(results))
      .catch((err) => res.status(500).json(err));
  });
};

const removeClient = (req, res) => {
  return Client.collection
    .deleteOne({ _id: ObjectId(req.body.clientId) })
    .then((results) => res.status(200).json(results))
    .catch((err) => res.status(500).json(err));
};

const getAppointments = (req, res) => {
  return Client.collection
    .aggregate([
      { $unwind: '$appointments' },
      { $sort: { 'appointments.appointment': 1 } },
      { $project: { appointment: '$appointments', _id: 1, name: 1, surname: 1 } }
    ])
    .toArray()
    .then((results) => res.status(200).json(results))
    .catch((err) => res.status(500).json(err));
};

const addAppointment = (req, res) => {
  const { name, surname, phone, address } = req.body;
  const { appointment, control, price, technician, treatment } = req.body;
  const clientId = req.params && req.params.clientId;

  const newAppointment = new Appointment({
    appointment,
    control,
    price,
    technician,
    treatment
  });

  return newAppointment.validate((err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      if (clientId) {
        const query = { _id: ObjectId(clientId) };
        const update = { $push: { appointments: newAppointment } };

        return Client.collection
          .updateOne(query, update)
          .then((results) => res.status(201).json(results))
          .catch((err) => res.status(500).json(err));
      }

      const appointments = [newAppointment];
      const newClient = {
        name,
        surname,
        phone,
        address,
        appointments
      };

      return Client.create(newClient)
        .then((results) => res.status(201).json(results))
        .catch((err) => res.status(500).json(err));
    }
  });
};

const modifyAppointment = (req, res) => {
  const { appointment, control, price, technician, treatment } = req.body;
  const id = ObjectId(req.params.id);
  const query = { 'appointments._id': id };
  const options = { arrayFilters: [{ 'element._id': id }] };
  const update = {
    $set: {
      'appointments.$[element].appointment': appointment,
      'appointments.$[element].control': control,
      'appointments.$[element].price': price,
      'appointments.$[element].technician': technician,
      'appointments.$[element].treatment': treatment
    }
  };

  return Client.collection
    .updateOne(query, update, options)
    .then((results) => res.status(200).json(results))
    .catch((err) => res.status(500).json(err));
};

const removeAppointment = (req, res) => {
  const id = ObjectId(req.params.id);
  const query = { 'appointments._id': id };
  const update = { $pull: { appointments: { _id: id } } };

  return Client.collection
    .updateOne(query, update)
    .then((results) => res.status(200).json(results))
    .catch((err) => res.status(500).json(err));
};

const ClientsController = {
  getClients,
  addClient,
  removeClient,
  getAppointments,
  addAppointment,
  modifyAppointment,
  removeAppointment
};

export default ClientsController;
