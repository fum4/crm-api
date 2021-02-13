import { Schema, model, Types } from 'mongoose';
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
  appointments: [Appointment.schema]
});

clientSchema.index({
  surname: 1,
  name: 1
});

const Client = model('Client', clientSchema);
export default Client;
