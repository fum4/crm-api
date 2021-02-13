import mongoose from 'mongoose';
import User from './user';
import Client from './client';
import Appointment from './appointment.js';
import 'dotenv/config';

const MongoURI = process.env.MONGO_URI;

const connectDb = () => {
  return mongoose.connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
};

const models = { User, Client, Appointment };

export { connectDb };

export default models;
