"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _auth = _interopRequireDefault(require("../config/auth.config"));

var _models = _interopRequireDefault(require("../models"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var User = _models["default"].models.User;
var Role = _models["default"].models.Role;

var register = function register(req, res) {
  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: _bcrypt["default"].hashSync(req.body.password, 8)
  });
  user.save(function (err, user) {
    if (err) {
      return res.status(500).send({
        message: err
      });
    }

    if (req.body.roles) {
      Role.find({
        name: {
          $in: req.body.roles
        }
      }, function (err, roles) {
        if (err) {
          return res.status(500).send({
            message: err
          });
        }

        user.roles = roles.map(function (role) {
          return role._id;
        });
        user.save(function (err) {
          if (err) {
            return res.status(500).send({
              message: err
            });
          }

          return res.send({
            message: 'User was registered successfully!'
          });
        });
      });
    } else {
      Role.findOne({
        name: 'User'
      }, function (err, role) {
        if (err) {
          return res.status(500).send({
            message: err
          });
        }

        user.roles = [role._id];
        user.save(function (err) {
          if (err) {
            return res.status(500).send({
              message: err
            });
          }

          return res.send({
            message: 'User was registered successfully!'
          });
        });
      });
    }
  });
};

var login = function login(req, res) {
  return User.findOne({
    username: req.body.username
  }).populate('roles', '-__v').exec(function (err, user) {
    if (err) {
      return res.status(500).send({
        message: err
      });
    }

    if (!user) {
      return res.status(404).send({
        message: 'User Not found.'
      });
    }

    var isPasswordValid = _bcrypt["default"].compareSync(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!'
      });
    }

    var token = _jsonwebtoken["default"].sign({
      id: user.id
    }, _auth["default"].secret, {
      expiresIn: 18000 // 5 hours

    });

    var authorities = [];
    user.roles.forEach(function (role) {
      authorities.push('ROLE_' + role.name.toUpperCase());
    });
    return res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  });
};

var AuthController = {
  login: login,
  register: register
};
var _default = AuthController;
exports["default"] = _default;