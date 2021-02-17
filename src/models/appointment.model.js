import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
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
  control: {
    type: String
  },
  price: {
    type: String
  },
  date: {
    type: Date,
    required: true
  }
});

appointmentSchema.index({
  date: 1
});

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;
