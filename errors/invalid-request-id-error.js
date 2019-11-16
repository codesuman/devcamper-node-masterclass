const ApplicationError = require("./application-error");

class InvalidRequestIDError extends ApplicationError {
  constructor(id) {
    super(`Requesting with invalid ID : ${id}`, 404);
  }
}

module.exports = InvalidRequestIDError;
