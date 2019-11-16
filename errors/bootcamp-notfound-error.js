const ApplicationError = require("./application-error");

class BootcampNotFoundError extends ApplicationError {
  constructor(id) {
    super(`No Bootcamp found with the id : ${id}`, 404);
  }
}

module.exports = BootcampNotFoundError;
