export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode ?? 500;
  let message = err.message;

  const response = {
    success: false,
    statusCode: statusCode,
    message: message,
    errors: err.errors || [],
  };

  return res.status(statusCode).json(response);
};
