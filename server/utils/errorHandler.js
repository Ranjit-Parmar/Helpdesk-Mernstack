// Development Errors
const devError = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
  return;
};

// Production Errors
const prodError = (res, error) => {

  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: error.statusCode,
      message: "something went wrong! please try again later",
    });
  }

  return;
};

// Cast Error Handler
const castErrorHandler = (res) => {

  res.status(400).json({
    success: false,
    message: "Bad Request! Invalid Object Id",
  });

  return;
};

// Duplicate Key Error Handler
const duplicateKeyErrorHandler = (error, res) => {

  const field = Object.keys(error.keyValue)[0];

  const errMsg = `The ${field} is already taken. Please choose a different ${field}.`;

  res.status(400).json({
    success: false,
    error: errMsg,
  });

  return;
};

// Validation Error Handler

const validationErrorHandler = (error, res) => {

  const errors = Object.values(error.errors).map((i) => i.message);
  const errorMessages = errors.join(", ");
  const msg = `Invalid input data: ${errorMessages}`;

  res.status(error.statusCode).json({
    status: error.status,
    message: msg,
  });

  return;
};

// Global Error Handler

export const errorHanlder = (error, req, res, next) => {

  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {

    devError(res, error);

  } else if (process.env.NODE_ENV === "production") {
   
    if (error.name === "CastError") {
      castErrorHandler(res);
      return;
    }
    if (error.code === 11000) {
      duplicateKeyErrorHandler(error, res);
      return;
    }
    if (error.name === "ValidationError") {
      validationErrorHandler(error, res);
      return;
    }

    prodError(res, error);
  }
};
