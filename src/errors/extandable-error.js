class ExtendableError extends Error {
  status = 400;
  errors = [];

  constructor(status, message, stack, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.stack = stack;
  }
}

module.exports = ExtendableError;
