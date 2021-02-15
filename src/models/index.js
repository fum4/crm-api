import mongoose from 'mongoose';
import User from './user';
import Client from './client';
import Appointment from './appointment.js';
import Role from './role.js';
import 'dotenv/config';

const MongoURI = process.env.MONGO_URI;

const connect = () => {
  return mongoose.connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
};

const models = { User, Client, Appointment, Role };
const roles = ['User', 'Moderator', 'Admin'];

const db = {
  connect,
  roles,
  models
};

export default db;
