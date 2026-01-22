const mongoose = require("mongoose");

/**
 * Global error handler for Express
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function globalErrorHandler(err, req, res, next) {
  // If you set custom status (e.g., from your controllers)
  if (err.httpStatus) {
    return res.status(err.httpStatus).json({
      message: err.message,
    });
  }

  // Handle Mongoose errors
  if (err instanceof mongoose.Error) {
    // Validation error
    if (err.name === "ValidationError") {
      const errors = Object.keys(err.errors).map((field) => {
        return {
          field,
          message: err.errors[field].message,
          kind: err.errors[field].kind,
        };
      });

      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    // Cast error (invalid ObjectId, etc.)
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid ${err.path}: ${err.value}`,
      });
    }
    // Other Mongoose errors
    return res.status(400).json({
      message: err.message,
    });
  }

  // MongoDB duplicate key error (code 11000)
  if (err instanceof mongoose.mongo.MongoServerError) {
    return res.status(400).json({
      message: "Already exists",
      paths: err.errorResponse.keyValue,
    });
  }
  // if (err.code && err.code === 11000) {
  //   const fields = Object.keys(err.keyValue);
  //   return res.status(400).json({
  //     message: `Duplicate value for field(s): ${fields.join(", ")}`,
  //   });
  // }

  // Log server errors to console for debugging
  console.error("Server Error:", err);

  // Send generic 500 error without leaking internal details
  return res.status(500).json({
    message: "Internal Server Error",
  });
}

module.exports = globalErrorHandler;
