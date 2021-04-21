"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../models"));

var _auth = _interopRequireDefault(require("../config/auth.config"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var User = _models["default"].user;
var Role = _models["default"].role;

var verifyToken = function verifyToken(req, res, next) {
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  var authorizationHeader = req.headers.authorization;
  var token = authorizationHeader && authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    });
  }

  _jsonwebtoken["default"].verify(token, _auth["default"].secret, function (err, decoded) {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!'
      });
    }

    req.userId = decoded.id;
    next();
  });
};

var isAdmin = function isAdmin(req, res, next) {
  User.findById(req.userId).exec(function (err, user) {
    if (err) {
      return res.status(500).send({
        message: err
      });
    }

    Role.find({
      _id: {
        $in: user.roles
      }
    }, function (err, roles) {
      if (err) {
        return res.status(500).send({
          message: err
        });
      }

      roles.forEach(function (role) {
        if (role.name === 'Admin') {
          return next();
        }
      });
      return res.status(403).send({
        message: 'Require Admin Role!'
      });
    });
  });
};

var isModerator = function isModerator(req, res, next) {
  User.findById(req.userId).exec(function (err, user) {
    if (err) {
      return res.status(500).send({
        message: err
      });
    }

    Role.find({
      _id: {
        $in: user.roles
      }
    }, function (err, roles) {
      if (err) {
        return res.status(500).send({
          message: err
        });
      }

      roles.forEach(function (role) {
        if (role.name === 'Moderator') {
          return next();
        }
      });
      return res.status(403).send({
        message: 'Require Moderator Role!'
      });
    });
  });
};

var authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator
};
var _default = authJwt;
exports["default"] = _default;