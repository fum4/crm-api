import { appointmentSchema } from './appointment';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
  },
  appointments: [appointmentSchema]
});

clientSchema.index({
  _id: 1
});

module.exports = mongoose.model('Client', clientSchema);
