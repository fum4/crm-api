import express from 'express';
import db from './src/models/index.js';
import { setupBaseMiddleware } from './src/middleware/index.js';
import { AuthRouter, ClientsRouter } from './src/routes/index.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT;

setupBaseMiddleware(app);

db.connect().then(() => {
  app.use(AuthRouter, ClientsRouter);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});

module.exports = app;