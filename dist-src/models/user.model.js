"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var userSchema = new _mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{
    type: _mongoose.Types.ObjectId,
    ref: 'Role'
  }]
});
userSchema.index({
  username: 1
});
var User = (0, _mongoose.model)('User', userSchema);
var _default = User;
exports["default"] = _default;