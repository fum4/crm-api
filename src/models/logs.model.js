import { Schema, model } from 'mongoose';

const logsSchema = new Schema({
  message: {
    type: {}
  },
  timestamp: {
    type: String
  }
});

logsSchema.index({
  timestamp: 1
});

const Logs = model('Logs', logsSchema);

export default Logs;
