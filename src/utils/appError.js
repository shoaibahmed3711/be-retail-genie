class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = this.getStatus(statusCode);
    this.isOperational = true;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  getStatus(statusCode) {
    const statusMap = {
      4: 'fail',
      5: 'error'
    };
    return statusMap[String(statusCode).charAt(0)] || 'error';
  }

  toJSON() {
    return {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
    };
  }
}

export default AppError; 