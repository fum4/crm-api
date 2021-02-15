import { Schema, model } from 'mongoose';
import Appointment from './appointment.js';

const clientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  address: {
    type: String
    // required: true
  },
  phone: {
    type: String,
    required: true
  },
  appointments: { type: [Appointment.schema], required: false }
});

clientSchema.index({
  name: 1,
  surname: 1
});

const Client = model('Client', clientSchema);

export default Client;
