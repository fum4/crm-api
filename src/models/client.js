import { Schema, model, Types } from 'mongoose';
import Appointment from './appointment.js';
const clientSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    required: true
  },
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

export default model('Client', clientSchema);
