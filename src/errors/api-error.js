const ExtendableError = require("./extandable-error");

class APIError extends ExtendableError {
  constructor({ status, message, errors, stack }) {
    super(status, message, stack, errors);
  }
}

module.exports = APIError;
