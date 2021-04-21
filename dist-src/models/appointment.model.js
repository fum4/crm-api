"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var appointmentSchema = new _mongoose.Schema({
  clientId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  appointment: {
    type: String,
    required: true
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
  control: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Control'
  },
  type: {
    type: String,
    "default": 'appointment'
  }
});
appointmentSchema.index({
  appointment: 1
});
var Appointment = (0, _mongoose.model)('Appointment', appointmentSchema);
var _default = Appointment;
exports["default"] = _default;