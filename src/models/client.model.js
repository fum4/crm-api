import { Schema, model } from 'mongoose';
import Appointment from './appointment.model';

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
