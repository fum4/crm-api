const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
const port = 3000;
const clientId = 'fum4';
const clientSecret = '1b2duj35';
const mongoUri = `mongodb+srv://${clientId}:${clientSecret}@cluster0.v48nx.mongodb.net/smil32-db?retryWrites=true&w=majority`; //?authSource=admin
const corsOptions = { origin: false };

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

const success = (res, payload) => {
  res.json(payload);
  res.status(200);
}

const error = (res, error) => {
  res.json(error);
  res.status(500);
}

const logErrorConnecting = (err, client) => {
  console.log('#### error connecting to db', err, client);
  console.log('#### error -> ', err);
  console.log('#### client -> ', client);
}

MongoClient.connect(mongoUri, (err, client) => {
  console.log('#### connected ');

  const db = client && client.db('smil32-db');

  if (db) {
    const clientsCollection = db.collection('clients');

    app.use(cors(corsOptions));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get('/clients', (req, res) => {
      clientsCollection.find().sort({ 'name': 1, 'surname': 1 }).toArray()
        .then(results => success(res, results))
        .catch(err => error(err));
    });

    app.post('/client', (req, res) => {
      clientsCollection.insertOne(req.body)
        .then(results => success(res, results))
        .catch(err => error(err));
    });

    app.post('/appointment', (req, res) => {
      const { appointment, control, date, price, technician, treatment } = req.body;

      clientsCollection.updateOne(
        { _id: req.body.client },
        { $push: { 'appointments': { appointment, control, date, price, technician, treatment } } }
      )
        .then(results => success(res, results))
        .catch(err => error(err));
    });

    app.get('/appointments', (req, res) => {
      clientsCollection.aggregate([
        {$unwind:'$appointments'},
        {$sort:{'appointments.date': 1}},
        {$project: { 'name': 1, 'surname': 1, 'appointment': '$appointments' } }
      ]).toArray()
        .then(results => success(res, results))
        .catch(err => error(err));
    });

    app.delete('/appointment', (req, res) => {
      clientsCollection.updateOne(
        { _id: req.body.clientId },
        { $pull: { '$appointments': { date: req.body.date } } }
      )
        .then(results => success(res, results))
        .catch(err => error(err));
    });

    app.put('/appointment', (req, res) => {
      clientsCollection.updateOne(
        { _id: req.body.clientId, 'appointments._id': req.body.appointment._id },
        { $set: res.body.appointment }
      )
        .then(results => success(res, results))
        .catch(err => error(err));
    });
  } else {
    logErrorConnecting(err, client);
  }
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
