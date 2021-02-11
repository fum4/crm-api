const express = require('express');
const cors = require('cors');

const setupAppMiddleware = (app) => {
  const corsOptions = { origin: false };

  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
  });
}

export default setupAppMiddleware;
