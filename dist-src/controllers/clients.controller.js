"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _models = _interopRequireDefault(require("../models"));

var _bson = require("bson");

var _static = require("../static");

var _helpers = require("../helpers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Client = _models["default"].models.Client;
var Appointment = _models["default"].models.Appointment;
var Control = _models["default"].models.Control;

var getNormalizedAppointmentsForClient = function getNormalizedAppointmentsForClient(client) {
  return Appointment.collection.find({
    clientId: client._id
  }).sort({
    appointment: 1
  }).toArray().then(function (appointments) {
    var promises = appointments.map(function (appointment) {
      return Control.collection.findOne({
        _id: appointment.control
      }).then(function (controlDocument) {
        return _objectSpread(_objectSpread({}, appointment), {}, {
          control: controlDocument === null || controlDocument === void 0 ? void 0 : controlDocument.date
        });
      });
    });
    return Promise.all(promises);
  });
};

var getNormalizedControlsForClient = function getNormalizedControlsForClient(client) {
  return Control.collection.find({
    clientId: client._id
  }).sort({
    date: 1
  }).toArray().then(function (controls) {
    var promises = controls.map(function (control) {
      return Appointment.collection.findOne({
        _id: control.appointmentId
      }).then(function (appointmentDocument) {
        control === null || control === void 0 ? true : delete control.control;
        return _objectSpread(_objectSpread({}, control), {}, {
          appointment: appointmentDocument === null || appointmentDocument === void 0 ? void 0 : appointmentDocument.appointment
        });
      });
    });
    return Promise.all(promises);
  });
};

var addAppointmentForClient = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(payload) {
    var clientId, appointment, price, technician, treatment, control, appointmentDocument, appointmentId, controlDocument;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            clientId = payload.clientId, appointment = payload.appointment, price = payload.price, technician = payload.technician, treatment = payload.treatment, control = payload.control;
            _context.next = 3;
            return Appointment.create({
              clientId: clientId,
              appointment: appointment,
              price: price,
              technician: technician,
              treatment: treatment
            });

          case 3:
            appointmentDocument = _context.sent;
            appointmentId = appointmentDocument._id;
            _context.t0 = control;

            if (!_context.t0) {
              _context.next = 10;
              break;
            }

            _context.next = 9;
            return Control.create({
              clientId: clientId,
              appointmentId: appointmentId,
              date: control,
              price: price,
              technician: technician,
              treatment: treatment
            });

          case 9:
            _context.t0 = _context.sent;

          case 10:
            controlDocument = _context.t0;
            _context.prev = 11;
            _context.next = 14;
            return Appointment.updateOne({
              _id: appointmentId
            }, {
              $set: {
                control: controlDocument === null || controlDocument === void 0 ? void 0 : controlDocument._id
              }
            });

          case 14:
            _context.next = 16;
            return Client.updateOne({
              _id: clientId
            }, {
              $push: {
                appointments: appointmentId
              }
            });

          case 16:
            return _context.abrupt("return", {
              success: true
            });

          case 19:
            _context.prev = 19;
            _context.t1 = _context["catch"](11);
            return _context.abrupt("return", {
              error: _context.t1
            });

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 19]]);
  }));

  return function addAppointmentForClient(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getAppointments = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var appointments, promises;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Appointment.collection.find().sort({
              appointment: 1
            }).toArray();

          case 2:
            appointments = _context2.sent;
            promises = appointments.map(function (appointment) {
              var clientInfo = Client.collection.findOne({
                _id: appointment.clientId
              }).then(function (client) {
                if (client) {
                  appointment.name = client.name;
                  appointment.surname = client.surname;
                  appointment.phone = client.phone;
                }
              });

              if (clientInfo) {
                var controlInfo = Control.collection.findOne({
                  _id: appointment.control
                }).then(function (control) {
                  appointment.control = control === null || control === void 0 ? void 0 : control.date;
                });
                return Promise.all([clientInfo, controlInfo]).then(function () {
                  return appointment;
                })["catch"](function (error) {
                  console.log(error);
                }); // TODO: refactor this
              }

              return false;
            });
            return _context2.abrupt("return", Promise.all(promises.filter(Boolean)));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getAppointments() {
    return _ref2.apply(this, arguments);
  };
}();

var getControls = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var controls, promises;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return Control.collection.find().sort({
              date: 1
            }).toArray();

          case 2:
            controls = _context3.sent;
            promises = controls.map(function (control) {
              var appointmentInfo = Appointment.collection.findOne({
                _id: control.appointmentId
              });
              var clientInfo = Client.collection.findOne({
                _id: control.clientId
              }).then(function (client) {
                if (client) {
                  control.name = client.name;
                  control.surname = client.surname;
                  control.phone = client.phone;
                }
              });

              if (clientInfo) {
                return Promise.all([clientInfo, appointmentInfo]).then(function () {
                  delete control.appointmentId;
                  delete control.clientId;
                  return control;
                })["catch"](function (error) {
                  console.log(error);
                }); // TODO: refactor this
              }

              return false;
            });
            return _context3.abrupt("return", Promise.all(promises.filter(Boolean)));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getControls() {
    return _ref3.apply(this, arguments);
  };
}();

var sortAppointmentsAndControls = function sortAppointmentsAndControls(appointmentsAndControls) {
  return appointmentsAndControls.sort(function (a, b) {
    if (a.type === 'control' && b.type === 'appointment') {
      return a.date < b.appointment ? -1 : 1;
    }

    if (a.type === 'appointment' && b.type === 'control') {
      return a.appointment < b.date ? -1 : 1;
    }

    if (a.type === 'appointment' && b.type === 'appointment') {
      return a.appointment < b.appointment ? -1 : 1;
    }

    if (a.type === 'control' && b.type === 'control') {
      return a.date < b.date ? -1 : 1;
    }
  });
};

var getClients = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var clientDocuments, clients;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return Client.collection.find().sort({
              name: 1,
              surname: 1
            }).toArray();

          case 2:
            clientDocuments = _context5.sent;
            _context5.next = 5;
            return clientDocuments.map( /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(document) {
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return getNormalizedAppointmentsForClient(document);

                      case 2:
                        document.appointments = _context4.sent;
                        _context4.next = 5;
                        return getNormalizedControlsForClient(document);

                      case 5:
                        document.controls = _context4.sent;
                        return _context4.abrupt("return", document);

                      case 7:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x4) {
                return _ref5.apply(this, arguments);
              };
            }());

          case 5:
            clients = _context5.sent;
            return _context5.abrupt("return", Promise.all(clients).then(function (normalizedClients) {
              return (0, _helpers.sendResponse)(res, 200, false, normalizedClients, _static.successMessages.GET_CLIENTS);
            })["catch"](function (error) {
              return (0, _helpers.sendResponse)(res, 500, true, error, _static.errorMessages.GET_CLIENTS);
            }));

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getClients(_x2, _x3) {
    return _ref4.apply(this, arguments);
  };
}();

var getAppointmentsAndControls = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var appointments, controls, appointmentsAndControls;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return getAppointments();

          case 3:
            appointments = _context6.sent;
            _context6.next = 6;
            return getControls();

          case 6:
            controls = _context6.sent;
            appointmentsAndControls = sortAppointmentsAndControls([].concat((0, _toConsumableArray2["default"])(appointments), (0, _toConsumableArray2["default"])(controls)));
            return _context6.abrupt("return", (0, _helpers.sendResponse)(res, 200, false, appointmentsAndControls, _static.successMessages.GET_APPOINTMENTS_AND_CONTROLS));

          case 11:
            _context6.prev = 11;
            _context6.t0 = _context6["catch"](0);
            return _context6.abrupt("return", (0, _helpers.sendResponse)(res, 500, true, _context6.t0, _static.errorMessages.GET_APPOINTMENTS_AND_CONTROLS));

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 11]]);
  }));

  return function getAppointmentsAndControls(_x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();

var addClient = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var _req$body, name, surname, phone, address, appointment, clientDocument, _req$body2, control, price, technician, treatment, appointmentPayload, addAppointmentResponse;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _req$body = req.body, name = _req$body.name, surname = _req$body.surname, phone = _req$body.phone, address = _req$body.address, appointment = _req$body.appointment;
            _context7.next = 3;
            return Client.create({
              name: name,
              surname: surname,
              phone: phone,
              address: address
            });

          case 3:
            clientDocument = _context7.sent;

            if (!appointment) {
              _context7.next = 13;
              break;
            }

            _req$body2 = req.body, control = _req$body2.control, price = _req$body2.price, technician = _req$body2.technician, treatment = _req$body2.treatment;
            appointmentPayload = {
              clientId: clientDocument._id,
              appointment: appointment,
              control: control,
              price: price,
              technician: technician,
              treatment: treatment
            };
            _context7.next = 9;
            return addAppointmentForClient(appointmentPayload);

          case 9:
            addAppointmentResponse = _context7.sent;

            if (!addAppointmentResponse.success) {
              _context7.next = 12;
              break;
            }

            return _context7.abrupt("return", getClients(req, res));

          case 12:
            return _context7.abrupt("return", (0, _helpers.sendResponse)(res, 500, true, addAppointmentResponse.error, _static.errorMessages.ADD_CLIENT));

          case 13:
            return _context7.abrupt("return", getClients(req, res));

          case 14:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function addClient(_x7, _x8) {
    return _ref7.apply(this, arguments);
  };
}();

var addAppointment = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var client, clientDocument, appointmentPayload, addAppointmentResponse;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            client = req.params && req.params.clientId;

            if (client) {
              _context8.next = 3;
              break;
            }

            return _context8.abrupt("return", addClient(req, res));

          case 3:
            _context8.prev = 3;
            _context8.next = 6;
            return Client.collection.findOne({
              _id: (0, _bson.ObjectId)(client)
            });

          case 6:
            clientDocument = _context8.sent;
            appointmentPayload = {
              clientId: clientDocument._id,
              appointment: req.body.appointment,
              control: req.body.control,
              price: req.body.price,
              technician: req.body.technician,
              treatment: req.body.treatment
            };
            _context8.next = 10;
            return addAppointmentForClient(appointmentPayload, req, res);

          case 10:
            addAppointmentResponse = _context8.sent;

            if (!addAppointmentResponse.success) {
              _context8.next = 13;
              break;
            }

            return _context8.abrupt("return", getAppointmentsAndControls(req, res));

          case 13:
            return _context8.abrupt("return", (0, _helpers.sendResponse)(res, 500, true, addAppointmentResponse.error, _static.errorMessages.ADD_APPOINTMENT));

          case 16:
            _context8.prev = 16;
            _context8.t0 = _context8["catch"](3);
            return _context8.abrupt("return", (0, _helpers.sendResponse)(res, 500, true, _context8.t0, _static.errorMessages.ADD_APPOINTMENT));

          case 19:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[3, 16]]);
  }));

  return function addAppointment(_x9, _x10) {
    return _ref8.apply(this, arguments);
  };
}();

var modifyAppointment = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var _req$body3, appointment, control, price, technician, treatment, appointmentId, appointmentDocument, appointmentPayload, controlPayload, controlId, currentControl, controlDocument;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _req$body3 = req.body, appointment = _req$body3.appointment, control = _req$body3.control, price = _req$body3.price, technician = _req$body3.technician, treatment = _req$body3.treatment;
            appointmentId = req.params.id && (0, _bson.ObjectId)(req.params.id);

            if (!appointmentId) {
              _context9.next = 35;
              break;
            }

            _context9.next = 5;
            return Appointment.collection.findOne({
              _id: appointmentId
            });

          case 5:
            appointmentDocument = _context9.sent;
            appointmentPayload = {
              appointment: appointment,
              price: price,
              technician: technician,
              treatment: treatment
            };
            controlPayload = {
              date: control,
              appointment: appointment,
              technician: technician,
              treatment: treatment
            };
            _context9.prev = 8;
            controlId = appointmentDocument.control;
            _context9.next = 12;
            return Control.collection.findOne({
              _id: controlId
            });

          case 12:
            currentControl = _context9.sent;

            if (!currentControl) {
              _context9.next = 18;
              break;
            }

            _context9.next = 16;
            return Control.collection.updateOne({
              _id: controlId
            }, {
              $set: _objectSpread({}, controlPayload)
            });

          case 16:
            _context9.next = 26;
            break;

          case 18:
            if (!control) {
              _context9.next = 26;
              break;
            }

            controlPayload.appointmentId = appointmentId;
            controlPayload.clientId = appointmentDocument.clientId;
            controlPayload.price = price;
            _context9.next = 24;
            return Control.create(_objectSpread({}, controlPayload));

          case 24:
            controlDocument = _context9.sent;
            controlId = controlDocument._id;

          case 26:
            appointmentPayload.control = controlId;
            _context9.next = 29;
            return Appointment.collection.updateOne({
              _id: appointmentId
            }, {
              $set: _objectSpread({}, appointmentPayload)
            });

          case 29:
            return _context9.abrupt("return", getAppointmentsAndControls(req, res));

          case 32:
            _context9.prev = 32;
            _context9.t0 = _context9["catch"](8);
            return _context9.abrupt("return", (0, _helpers.sendResponse)(res, 500, true, _context9.t0, _static.errorMessages.MODIFY_APPOINTMENT));

          case 35:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[8, 32]]);
  }));

  return function modifyAppointment(_x11, _x12) {
    return _ref9.apply(this, arguments);
  };
}();

var modifyControl = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var _req$body4, date, control, price, treatment, technician, controlId, _controlDocument, controlDocument, _yield$Control$collec, appointmentId, clientId, payload;

    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _req$body4 = req.body, date = _req$body4.date, control = _req$body4.control, price = _req$body4.price, treatment = _req$body4.treatment, technician = _req$body4.technician;
            controlId = req.params.id && (0, _bson.ObjectId)(req.params.id);

            if (!controlId) {
              _context10.next = 14;
              break;
            }

            if (!control) {
              _context10.next = 12;
              break;
            }

            _context10.next = 6;
            return Control.collection.findOne({
              _id: controlId
            });

          case 6:
            _yield$Control$collec = _context10.sent;
            appointmentId = _yield$Control$collec.appointmentId;
            clientId = _yield$Control$collec.clientId;
            _context10.next = 11;
            return Control.create({
              date: control,
              appointmentId: appointmentId,
              clientId: clientId,
              price: price,
              treatment: treatment,
              technician: technician
            });

          case 11:
            controlDocument = _context10.sent;

          case 12:
            payload = {
              control: (_controlDocument = controlDocument) === null || _controlDocument === void 0 ? void 0 : _controlDocument._id,
              date: date,
              price: price,
              treatment: treatment,
              technician: technician
            };
            return _context10.abrupt("return", Control.collection.updateOne({
              _id: controlId
            }, {
              $set: _objectSpread({}, payload)
            }).then(function () {
              return getAppointmentsAndControls(req, res);
            }) // TODO: refactor
            ["catch"](function (error) {
              return (0, _helpers.sendResponse)(res, 500, true, error, _static.errorMessages.MODIFY_CONTROL);
            }));

          case 14:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function modifyControl(_x13, _x14) {
    return _ref10.apply(this, arguments);
  };
}();

var removeClient = function removeClient(req, res) {
  var clientId = (0, _bson.ObjectId)(req.params.id);
  return Client.collection.deleteOne({
    _id: clientId
  }).then(function () {
    return Appointment.collection.deleteMany({
      clientId: clientId
    });
  }).then(function () {
    return Control.collection.deleteMany({
      clientId: clientId
    });
  }).then(function () {
    return getClients(req, res);
  })["catch"](function (error) {
    return (0, _helpers.sendResponse)(res, 500, true, error, _static.errorMessages.REMOVE_CLIENT);
  });
};

var removeAppointment = function removeAppointment(req, res) {
  var appointmentId = (0, _bson.ObjectId)(req.params.id);
  return Appointment.collection.deleteOne({
    _id: appointmentId
  }).then(function () {
    return Control.collection.deleteMany({
      appointmentId: appointmentId
    });
  }).then(function () {
    return getAppointmentsAndControls(req, res);
  })["catch"](function (error) {
    return (0, _helpers.sendResponse)(res, 500, true, error, _static.errorMessages.REMOVE_APPOINTMENT);
  });
};

var removeControl = function removeControl(req, res) {
  return Control.collection.deleteOne({
    _id: (0, _bson.ObjectId)(req.params.id)
  }).then(function () {
    return getAppointmentsAndControls(req, res);
  })["catch"](function (error) {
    return (0, _helpers.sendResponse)(res, 500, true, error, _static.errorMessages.REMOVE_CONTROL);
  });
};

var ClientsController = {
  getClients: getClients,
  getAppointmentsAndControls: getAppointmentsAndControls,
  addClient: addClient,
  addAppointment: addAppointment,
  modifyAppointment: modifyAppointment,
  modifyControl: modifyControl,
  removeClient: removeClient,
  removeControl: removeControl,
  removeAppointment: removeAppointment
};
var _default = ClientsController;
exports["default"] = _default;