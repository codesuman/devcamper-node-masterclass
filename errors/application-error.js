class ApplicationError extends Error {
  constructor(message, statusCode) {
    super(message || "Something went wrong. Please try again.");

    this.statusCode = statusCode || 500;
  }
}

module.exports = ApplicationError;
