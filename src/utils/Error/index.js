export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    await fn(req, res, next).catch((err) => next(err));
  };
};

export const GlobalError = (err, req, res, next) => {
  return res.status(err["cause"]?.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: err.stack,
  });
};
