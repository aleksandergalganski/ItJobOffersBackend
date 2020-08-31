const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, rest, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err.stack.red);

  // Mongose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with the id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicated key
  if (err.code === 11000) {
    const message = 'Duplicated field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(value => value.message);
    error = new ErrorResponse(message, 400);
  }

  rest.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error'
  });
};

module.exports = errorHandler;
