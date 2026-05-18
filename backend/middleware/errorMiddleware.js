// middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  let statusCode = 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 11000) {
    statusCode = 400;
    message = 'This email is already registered';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  return res.status(statusCode).json({ success: false, message });
};

module.exports = { errorHandler };