"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AuthController", {
  enumerable: true,
  get: function get() {
    return _auth["default"];
  }
});
Object.defineProperty(exports, "ClientsController", {
  enumerable: true,
  get: function get() {
    return _clients["default"];
  }
});

var _auth = _interopRequireDefault(require("./auth.controller"));

var _clients = _interopRequireDefault(require("./clients.controller"));