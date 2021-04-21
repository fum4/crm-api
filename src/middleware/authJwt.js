import db from '../models';
import config from '../config/auth.config';
import jwt from 'jsonwebtoken';

const User = db.user;
const Role = db.role;

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

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        roles.forEach((role) => {
          if (role.name === 'Admin') {
            return next();
          }
        });

        return res.status(403).send({ message: 'Require Admin Role!' });
      }
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        roles.forEach((role) => {
          if (role.name === 'Moderator') {
            return next();
          }
        });

        return res.status(403).send({ message: 'Require Moderator Role!' });
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};

export default authJwt;
