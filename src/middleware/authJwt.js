import config from '../config/auth.config';
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  if (req.path === '/') {
    return next();
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader && authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }

    req.userId = decoded.id;

    next();
  });
};

const authJwt = {
  verifyToken
};

export default authJwt;
