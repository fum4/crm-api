"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _cors = _interopRequireDefault(require("cors"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var setupBaseMiddleware = function setupBaseMiddleware(app) {
  var corsOptions = {
    origin: false
  };
  app.use((0, _cors["default"])(corsOptions));
  app.use((0, _express.urlencoded)({
    extended: true
  }));
  app.use((0, _express.json)());
  app.use((0, _cookieParser["default"])());
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
};

var _default = setupBaseMiddleware;
exports["default"] = _default;