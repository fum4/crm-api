import { Schema, model } from 'mongoose';

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
    type: String
  },
  appointments: {
    type: [Schema.Types.ObjectId],
    ref: 'Appointment'
  },
  comments: {
    type: String
  }
}, {
  versionKey: false
});

clientSchema.index({
  name: 1,
  surname: 1
});

const Client = model('Client', clientSchema);

export default Client;
