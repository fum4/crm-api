"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AuthRouter", {
  enumerable: true,
  get: function get() {
    return _auth["default"];
  }
});
Object.defineProperty(exports, "ClientsRouter", {
  enumerable: true,
  get: function get() {
    return _clients["default"];
  }
});

var _auth = _interopRequireDefault(require("./auth.route"));

var _clients = _interopRequireDefault(require("./clients.route"));