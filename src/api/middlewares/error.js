const APIError = require("../../errors/api-error");

const handler = (err, _req, res, next) => {
  const response = {
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack,
  };

  res.status(err.status || 400);
  res.json(response);
};

const notFound = (req, res, next) => {
  const err = new APIError({
    message: "Not found",
    status: 404,
    errors: [],
    stack: "",
  });
  return handler(err, req, res, next);
};

exports.handler = handler;
exports.notFound = notFound;
