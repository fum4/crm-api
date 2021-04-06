import db from './models';

const buildResponse = (data, message, type) => {
  return {
    data,
    message,
    type
  }
}

export const buildErrorResponse = (data, message) => {
  return buildResponse(data, message, 'error');
}

export const buildSuccessResponse = (data, message) => {
  return buildResponse(data, message, 'success');
}

export const sendResponse = (response, status, isError, payload, message) => {
  const type = isError ? 'error' : 'success';
  const timestamp = new Date();
  const data = isError
    ? buildErrorResponse(payload, message)
    : buildSuccessResponse(payload, message);

  const logInfo = {
    info: data,
    timestamp,
    status
  };

  return db.logs.collection
    .insertOne(logInfo)
    .finally(() => response.status(status).json({ data: payload, message, type }));
}
