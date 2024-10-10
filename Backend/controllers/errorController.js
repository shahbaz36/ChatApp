const AppError = require("../utils/AppError");

// Mongoose errors
const handleCaseErrorDB = function (error) {
  const message = `Invalid ${error.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = function (error) {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value : ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = function (error) {
  const errorsMessages = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data. ${errorsMessages.join(". ")}`;

  return new AppError(message, 400);
};

// Production and development error
const sendProdError = function (err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error:", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const sendDevError = function (err, res) {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

//GEH
module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = handleCaseErrorDB(error);
    if (err.code === 11000) error = handleDuplicateErrorDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);

    sendProdError(error, res);
  }
};
