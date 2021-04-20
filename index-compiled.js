"use strict";

var _express = _interopRequireDefault(require("express"));

var _models = _interopRequireDefault(require("./src/models"));

var _middleware = require("./src/middleware");

var _routes = require("./src/routes");

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var port = process.env.PORT;
(0, _middleware.setupBaseMiddleware)(app);

_models["default"].connect().then(function () {
  app.use(_routes.AuthRouter, _routes.ClientsRouter);
  app.listen(port, function () {
    return console.log("Example app listening on port ".concat(port, "!"));
  });
});
