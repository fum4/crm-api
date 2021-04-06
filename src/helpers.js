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
