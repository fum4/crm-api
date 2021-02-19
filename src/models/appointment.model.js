import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  appointment: {
    type: String,
    required: true
  },
  treatment: {
    type: String
  },
  technician: {
    type: String
  },
  price: {
    type: String
  },
  control: {
    type: Schema.Types.ObjectId,
    ref: 'Control'
  },
  type: {
    type: String,
    default: 'appointment'
  }
});

appointmentSchema.index({
  appointment: 1
});

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;
