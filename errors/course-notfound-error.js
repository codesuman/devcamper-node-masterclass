const ApplicationError = require("./application-error");

class CourseNotFoundError extends ApplicationError {
    constructor(id) {
        super(`No Course found with the id : ${id}`, 404);
    }
}

module.exports = CourseNotFoundError;
