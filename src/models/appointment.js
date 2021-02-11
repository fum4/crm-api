const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export const appointmentSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  control: {
    type: String,
    required: true,
  },
  appointment: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true,
  },
  technician: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true,
  }
});

appointmentSchema.index({
  _id: 1
});

module.exports = mongoose.model('Appointment', appointmentSchema);
