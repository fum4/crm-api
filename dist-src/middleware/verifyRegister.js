"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../models"));

var ROLES = _models["default"].ROLES;
var User = _models["default"].models.User;

var checkDuplicateUsernameOrEmail = function checkDuplicateUsernameOrEmail(req, res, next) {
  return User.findOne({
    username: req.body.username
  }).exec(function (err, user) {
    if (err) {
      return res.status(500).send({
        message: err
      });
    }

    if (user) {
      return res.status(400).send({
        message: 'Failed! Username is already in use!'
      });
    }

    next();
  });
};

var checkRolesExisted = function checkRolesExisted(req, res, next) {
  if (req.body.roles) {
    return req.body.roles.forEach(function (role) {
      if (!ROLES.includes(role)) {
        return res.status(400).send({
          message: "Failed! Role ".concat(role, " does not exist!")
        });
      }
    });
  }

  next();
};

var verifyRegister = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};
var _default = verifyRegister;
exports["default"] = _default;