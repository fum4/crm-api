"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var controlSchema = new _mongoose.Schema({
  clientId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  appointmentId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  control: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Control'
  },
  treatment: {
    type: String
  },
  technician: {
    type: String
  },
  price: {
    type: String
  },
  type: {
    type: String,
    "default": 'control'
  }
});
controlSchema.index({
  control: 1
});
var Control = (0, _mongoose.model)('Control', controlSchema);
var _default = Control;
exports["default"] = _default;