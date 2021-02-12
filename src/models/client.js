import { Schema, model } from 'mongoose';

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
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

clientSchema.index({
  surname: 1,
  name: 1
});

export default model('Client', clientSchema);
