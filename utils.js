export const successHandler = (res, payload) => {
  res.json(payload);
  res.status(200);
};

export const errorHandler = (res, err) => {
  const { matchedCount, modifiedCount } = res;

  console.log('#### error ::: matchedCount / modifiedCount : ', matchedCount, modifiedCount);
  console.log('#### query response -> ', res);
  console.log('#### error -> ', err);
  err.status(500);
};

export const logErrorConnecting = (err, client) => {
  console.log('#### error connecting to db', err, client);
  console.log('#### error -> ', err);
  console.log('#### client -> ', client);
};

export const buildMongoUri = (username, password) =>
  `mongodb+srv://${username}:${password}@cluster0.v48nx.mongodb.net/smil32-db?retryWrites=true&w=majority`;

export const generateId = () => (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
