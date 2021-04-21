"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var logsSchema = new _mongoose.Schema({
  message: {
    type: {}
  },
  timestamp: {
    type: String
  }
});
logsSchema.index({
  timestamp: -1
});
var Logs = (0, _mongoose.model)('Logs', logsSchema);
var _default = Logs;
exports["default"] = _default;