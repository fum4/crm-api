"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _controllers = require("../controllers");

var _middleware = require("../middleware");

var ClientsRouter = _express["default"].Router();

ClientsRouter.use(_middleware.authJwt.verifyToken);
ClientsRouter.get('/clients', _controllers.ClientsController.getClients);
ClientsRouter.post('/client', _controllers.ClientsController.addClient);
ClientsRouter["delete"]('/client/:id', _controllers.ClientsController.removeClient);
ClientsRouter.get('/appointments', _controllers.ClientsController.getAppointmentsAndControls);
ClientsRouter.post('/appointment/:clientId?', _controllers.ClientsController.addAppointment);
ClientsRouter.put('/appointment/:id', _controllers.ClientsController.modifyAppointment);
ClientsRouter["delete"]('/appointment/:id', _controllers.ClientsController.removeAppointment);
ClientsRouter.put('/control/:id', _controllers.ClientsController.modifyControl);
ClientsRouter["delete"]('/control/:id', _controllers.ClientsController.removeControl);
var _default = ClientsRouter;
exports["default"] = _default;