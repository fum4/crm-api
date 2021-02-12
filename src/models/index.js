import mongoose from 'mongoose';
import User from './user';
import Client from './Client';
import 'dotenv/config';

const connectDb = () => {
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
};

const models = { User, Client };

export { connectDb };

export default models;
