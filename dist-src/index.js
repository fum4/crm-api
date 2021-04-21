"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _models = _interopRequireDefault(require("./models"));

var _middleware = require("./middleware");

var _routes = require("./routes");

require("dotenv/config");

var app = (0, _express["default"])();
var port = process.env.PORT;
(0, _middleware.setupBaseMiddleware)(app);

_models["default"].connect().then(function () {
  app.use(_routes.AuthRouter, _routes.ClientsRouter);
  app.listen(port, function () {
    return console.log("Example app listening on port ".concat(port, "!"));
  });
});