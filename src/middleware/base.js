import { urlencoded, json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const setupBaseMiddleware = (app) => {
  const corsOptions = { origin: false };

  app.use(cors(corsOptions));
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookieParser());

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
  });
};

export default setupBaseMiddleware;
