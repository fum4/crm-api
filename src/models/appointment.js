import { Schema, model, Types } from 'mongoose';

const appointmentSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    required: true
  },
  appointment: {
    type: String
    // required: true
  },
  treatment: {
    type: String
    // required: true
  },
  technician: {
    type: String
    // required: true
  },
  control: {
    type: String
    // required: true
  },
  price: {
    type: String
    // required: true
  },
  date: {
    type: Date,
    required: true
  },
  clientId: { type: Types.ObjectId, ref: 'Client' }
});

appointmentSchema.index({
  date: 1
});

const Appointment = model('Appointment', appointmentSchema);
export default Appointment;
