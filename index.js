import express from 'express';
import 'dotenv/config';
import setupAppMiddleware from './src/middleware/app';
import models, { connectDb } from './src/models';
import { ObjectId } from 'bson';

const app = express();
const port = process.env.PORT;

setupAppMiddleware(app);

connectDb().then(async () => {
  const mongooseTest = async () => {
    const clientTest = new models.Client({
      _id: ObjectId(),
      name: 'MongooseTest',
      surname: 'MongooseTest Prenume',
      phone: '07328382838'
    });
    await clientTest.save();
  };
  mongooseTest();
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
