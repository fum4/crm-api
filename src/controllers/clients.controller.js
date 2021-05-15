import db from '../models';
import { ObjectId } from 'bson';
import { errorMessages, successMessages } from '../static';
import { sendResponse } from '../helpers';

const Client = db.models.Client;
const Appointment = db.models.Appointment;
const Control = db.models.Control;

const getNormalizedAppointmentsForClient = (client) => {
  return Appointment.collection
    .find({ clientId: client._id })
    .sort({ appointment: 1 })
    .toArray()
    .then((appointments) => {
      const promises = appointments.map((appointment) => {
        return Control.collection
          .findOne({ _id: appointment.control })
          .then((controlDocument) => ({
            ...appointment,
            control: controlDocument?.date
          }));
      });

      return Promise.all(promises);
    });
};

const getNormalizedControlsForClient = (client) => {
  return Control.collection
    .find({ clientId: client._id })
    .sort({ date: 1 })
    .toArray()
    .then((controls) => {
      const promises = controls.map((control) => {
        return Appointment.collection
          .findOne({ _id: control.appointmentId })
          .then((appointmentDocument) => {
            delete control?.control;

            return {
              ...control,
              appointment: appointmentDocument?.appointment
            }
          });
      });

      return Promise.all(promises);
    });
};

const addAppointmentForClient = async (payload) => {
  const { clientId, appointment, price, technician, treatment, control } = payload;

  const appointmentDocument = await Appointment.create({
    clientId,
    appointment,
    price,
    technician,
    treatment
  });

  const appointmentId = appointmentDocument._id;

  const controlDocument = control && await Control.create({
    clientId,
    appointmentId,
    date: control,
    price,
    technician,
    treatment
  });

  try {
    await Appointment.updateOne({ _id: appointmentId }, { $set: { control: controlDocument?._id } });
    await Client.updateOne({ _id: clientId }, { $push: { appointments: appointmentId } });

    return { success: true }; // TODO: refactor
  } catch (error) {
    return { error };
  }
}

const getAppointments = async () => {
  const appointments = await Appointment.collection
    .find()
    .sort({ appointment: 1 })
    .toArray();

  const promises = appointments.map((appointment) => {
    const clientInfo = Client.collection
      .findOne({ _id: appointment.clientId })
      .then((client) => {
        if (client) {
          appointment.name = client.name;
          appointment.surname = client.surname;
          appointment.phone = client.phone;
        }
      });

    if (clientInfo) {
      const controlInfo = Control.collection
        .findOne({ _id: appointment.control })
        .then((control) => {
          appointment.control = control?.date;
        });

      return Promise.all([clientInfo, controlInfo])
        .then(() => appointment)
        .catch((error) => { console.log(error) }); // TODO: refactor this
    }

    return false;
  });

  return Promise.all(promises.filter(Boolean));
};

const getControls = async () => {
  const controls = await Control.collection
    .find()
    .sort({ date: 1 })
    .toArray();

  const promises = controls.map((control) => {
    const appointmentInfo = Appointment.collection
      .findOne({ _id: control.appointmentId })
        .then((appointment) => {
          if (appointment) {
            control.appointment = appointment.appointment;
          }
        });

    const clientInfo = Client.collection
      .findOne({ _id: control.clientId })
      .then((client) => {
        if (client) {
          control.name = client.name;
          control.surname = client.surname;
          control.phone = client.phone;
        }
      });

    if (clientInfo) {
      return Promise.all([clientInfo, appointmentInfo])
        .then(() => control)
        .catch((error) => { console.log(error) }); // TODO: refactor this
    }

    return false;
  });

  return Promise.all(promises.filter(Boolean));
};

const sortAppointmentsAndControls = (appointmentsAndControls) => {
  return appointmentsAndControls.sort((a, b) => {
    if (a.type === 'control' && b.type === 'appointment') {
      return a.date < b.appointment ? -1 : 1;
    }

    if (a.type === 'appointment' && b.type === 'control') {
      return a.appointment < b.date ? -1 : 1;
    }

    if (a.type === 'appointment' && b.type === 'appointment') {
      return a.appointment < b.appointment ? -1 : 1;
    }

    if (a.type === 'control' && b.type === 'control') {
      return a.date < b.date ? -1 : 1;
    }
  })
}

const getClients = async (req, res) => {
  const clientDocuments = await Client.collection
    .find()
    .sort({ name: 1, surname: 1 })
    .toArray();

  const clients = await clientDocuments.map(async (document) => {
    document.appointments = await getNormalizedAppointmentsForClient(document);
    document.controls = await getNormalizedControlsForClient(document);

    return document;
  });

  return Promise.all(clients)
    .then((normalizedClients) => sendResponse(res, 200, false, normalizedClients, successMessages.GET_CLIENTS))
    .catch((error) => sendResponse(res, 500, true, error,errorMessages.GET_CLIENTS));
};

const getAppointmentsAndControls = async (req, res) => {
  try {
    const appointments = await getAppointments();
    const controls = await getControls();
    const appointmentsAndControls = sortAppointmentsAndControls([...appointments, ...controls]);

    return sendResponse(res, 200, false, appointmentsAndControls, successMessages.GET_APPOINTMENTS_AND_CONTROLS);
  } catch (error) {
    return sendResponse(res, 500, true, error, errorMessages.GET_APPOINTMENTS_AND_CONTROLS);
  }
};

const addClient = async (req, res) => {
  const { name, surname, phone, address, appointment, comments } = req.body;

  const clientDocument = await Client.create({
    name,
    surname,
    phone,
    address,
    comments
  });

  if (appointment) {
    const { control, price, technician, treatment } = req.body;

    const appointmentPayload = {
      clientId: clientDocument._id,
      appointment,
      control,
      price,
      technician,
      treatment
    }

    const addAppointmentResponse = await addAppointmentForClient(appointmentPayload);

    if (addAppointmentResponse.success) {
      return getClients(req, res);
    }

    return sendResponse(res, 500, true, addAppointmentResponse.error, errorMessages.ADD_CLIENT);
  }

  return getClients(req, res);
};

const addAppointment = async (req, res) => {
  const client = req.params && req.params.clientId;

  if (!client) {
    return addClient(req, res);
  }

  try {
    const clientDocument = await Client.collection.findOne({ _id: ObjectId(client) });

    const appointmentPayload = {
      clientId: clientDocument._id,
      appointment: req.body.appointment,
      control: req.body.control,
      price: req.body.price,
      technician: req.body.technician,
      treatment: req.body.treatment
    }

    const addAppointmentResponse = await addAppointmentForClient(appointmentPayload, req, res);

    if (addAppointmentResponse.success) { // TODO: refactor
      return getAppointmentsAndControls(req, res);
    }

    return sendResponse(res, 500, true, addAppointmentResponse.error, errorMessages.ADD_APPOINTMENT);
  } catch(error) {
    return sendResponse(res, 500, true, error, errorMessages.ADD_APPOINTMENT);
  }
};

const modifyAppointment = async (req, res) => {
  const { appointment, control, price, technician, treatment } = req.body;
  const appointmentId = req.params.id && ObjectId(req.params.id);

  if (appointmentId) {
    const appointmentDocument = await Appointment.collection.findOne({ _id: appointmentId });

    const appointmentPayload = {
      appointment,
      price,
      technician,
      treatment
    };
    const controlPayload = {
      date: control,
      appointment,
      technician,
      treatment
    };

    try {
      let controlId = appointmentDocument.control;

      const currentControl = await Control.collection.findOne({ _id: controlId });

      if (currentControl) {
        await Control.collection.updateOne({ _id: controlId }, { $set: { ...controlPayload } });
      } else {
        if (control) {
          controlPayload.appointmentId = appointmentId;
          controlPayload.clientId = appointmentDocument.clientId;
          controlPayload.price = price;

          const controlDocument = await Control.create({ ...controlPayload });

          controlId = controlDocument._id;
        }
      }

      appointmentPayload.control = controlId;

      await Appointment.collection.updateOne({ _id: appointmentId }, { $set: { ...appointmentPayload } });

      return getAppointmentsAndControls(req, res);
    } catch (error) {
      return sendResponse(res, 500, true, error, errorMessages.MODIFY_APPOINTMENT);
    }
  }
};

const modifyControl = async (req, res) => {
  const { date, control, price, treatment, technician } = req.body;
  const controlId = req.params.id && ObjectId(req.params.id);

  if (controlId) {
    let controlDocument;

    if (control) {
      const { appointmentId, clientId } = await Control.collection.findOne({ _id: controlId });

      controlDocument = await Control.create({
        date: control,
        appointmentId,
        clientId,
        price,
        treatment,
        technician
      });
    }

    const payload = {
      control: controlDocument?._id,
      date,
      price,
      treatment,
      technician
    };

    return Control.collection
      .updateOne({ _id: controlId }, { $set: { ...payload } })
      .then(() => getAppointmentsAndControls(req, res)) // TODO: refactor
      .catch((error) => sendResponse(res, 500, true, error, errorMessages.MODIFY_CONTROL));
  }
};

const modifyClient = async (req, res) => {
  const { name, surname, phone, comments } = req.body;
  const clientId = req.params.id && ObjectId(req.params.id);

  if (clientId) {
    return Client.collection
      .updateOne({ _id: clientId }, { $set: { name, surname, phone, comments } })
        .then(() => getClients(req, res))
      .catch((error) => sendResponse(res, 500, true, error, errorMessages.MODIFY_CLIENT));
  }
};

const removeClient = (req, res) => {
  const clientId = ObjectId(req.params.id);

  return Client.collection
    .deleteOne({ _id: clientId })
    .then(() => Appointment.collection.deleteMany({ clientId }))
    .then(() => Control.collection.deleteMany({ clientId }))
    .then(() => getClients(req, res))
    .catch((error) => sendResponse(res, 500, true, error, errorMessages.REMOVE_CLIENT));
};

const removeAppointment = (req, res) => {
  const appointmentId = ObjectId(req.params.id);

  return Appointment.collection
    .deleteOne({ _id: appointmentId })
    .then(() => Control.collection.deleteMany({ appointmentId }))
    .then(() => getAppointmentsAndControls(req, res))
    .catch((error) => sendResponse(res, 500, true, error, errorMessages.REMOVE_APPOINTMENT));
};

const removeControl = (req, res) => {
  return Control.collection
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(() => getAppointmentsAndControls(req, res))
    .catch((error) => sendResponse(res, 500, true, error, errorMessages.REMOVE_CONTROL));
};

const ClientsController = {
  getClients,
  getAppointmentsAndControls,
  addClient,
  addAppointment,
  modifyClient,
  modifyAppointment,
  modifyControl,
  removeClient,
  removeControl,
  removeAppointment
};

export default ClientsController;
