import { Schema, model } from 'mongoose';

const controlSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  control: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
  },
  price: {
    type: String
  },
  type: {
    type: String,
    default: 'control'
  }
});

controlSchema.index({
  control: 1
});

const Control = model('Control', controlSchema);

export default Control;
