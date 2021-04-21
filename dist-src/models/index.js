"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _user = _interopRequireDefault(require("./user.model"));

var _client = _interopRequireDefault(require("./client.model"));

var _appointment = _interopRequireDefault(require("./appointment.model"));

var _control = _interopRequireDefault(require("./control.model"));

var _role = _interopRequireDefault(require("./role.model"));

var _logs = _interopRequireDefault(require("./logs.model"));

require("dotenv/config");

var MongoURI = process.env.MONGO_URI;

var connect = function connect() {
  return _mongoose["default"].connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
};

var models = {
  User: _user["default"],
  Client: _client["default"],
  Appointment: _appointment["default"],
  Control: _control["default"],
  Role: _role["default"]
};
var ROLES = ['User', 'Moderator', 'Admin'];
var db = {
  connect: connect,
  ROLES: ROLES,
  models: models,
  logs: _logs["default"]
};
var _default = db;
exports["default"] = _default;