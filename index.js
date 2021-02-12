import express from 'express';
import 'dotenv/config';
import setupAppMiddleware from './src/middleware/app';
import models, { connectDb } from './src/models';

const app = express();
const port = process.env.PORT;

setupAppMiddleware(app);

connectDb().then(async () => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
