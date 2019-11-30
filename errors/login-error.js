const ApplicationError = require("./application-error");

class LoginError extends ApplicationError {
    constructor(msg, statusCode) {
        super(msg, statusCode || 400);
    }
}

module.exports = LoginError;
