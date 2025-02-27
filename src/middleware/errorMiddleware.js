const errorHandler = (err, req, res, next) => {
  const error = err.toJSON ? err.toJSON() : {
    status: 'error',
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  };

  res.status(error.statusCode).json(error);
};

export default errorHandler;