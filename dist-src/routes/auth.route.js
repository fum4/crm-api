"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _controllers = require("../controllers");

var _middleware = require("../middleware");

var AuthRouter = _express["default"].Router();

AuthRouter.post('/login', _controllers.AuthController.login);
AuthRouter.post('/register', [_middleware.verifyRegister.checkDuplicateUsernameOrEmail, _middleware.verifyRegister.checkRolesExisted], _controllers.AuthController.register);
var _default = AuthRouter;
exports["default"] = _default;