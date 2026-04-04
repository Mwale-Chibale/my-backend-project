const errorHandler = (err, req, res, next) => {
 
  console.error('🔥 Error caught by Global Handler:', err.message);

  // If the error already has a status code, use it. Otherwise, default to 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  // Send a perfectly formatted JSON response to the frontend
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'Something went wrong on the server.',
    
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;