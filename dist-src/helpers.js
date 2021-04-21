"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendResponse = exports.buildSuccessResponse = exports.buildErrorResponse = void 0;

var _models = _interopRequireDefault(require("./models"));

var buildResponse = function buildResponse(data, message, type) {
  return {
    data: data,
    message: message,
    type: type
  };
};

var buildErrorResponse = function buildErrorResponse(data, message) {
  return buildResponse(data, message, 'error');
};

exports.buildErrorResponse = buildErrorResponse;

var buildSuccessResponse = function buildSuccessResponse(data, message) {
  return buildResponse(data, message, 'success');
};

exports.buildSuccessResponse = buildSuccessResponse;

var sendResponse = function sendResponse(response, status, isError, payload, message) {
  var type = isError ? 'error' : 'success';
  var timestamp = new Date();
  var data = isError ? buildErrorResponse(payload, message) : buildSuccessResponse(payload, message);
  var logInfo = {
    info: data,
    timestamp: timestamp,
    status: status
  };
  return _models["default"].logs.collection.insertOne(logInfo)["finally"](function () {
    return response.status(status).json({
      data: payload,
      message: message,
      type: type
    });
  });
};

exports.sendResponse = sendResponse;