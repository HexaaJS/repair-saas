const sendResponse = (res, statusCode, data = null, message = null) => {
  const response = {
    success: true,
  };

  if (message) response.message = message;
  if (data) response.data = data;

  res.status(statusCode).json(response);
};

module.exports = sendResponse;