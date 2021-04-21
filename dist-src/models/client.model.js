"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var clientSchema = new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  appointments: {
    type: [_mongoose.Schema.Types.ObjectId],
    ref: 'Appointment'
  }
});
clientSchema.index({
  name: 1,
  surname: 1
});
var Client = (0, _mongoose.model)('Client', clientSchema);
var _default = Client;
exports["default"] = _default;