const notFound = (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
};

const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Server error";
  let errors = err.errors;

  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation error";
    errors = Object.values(err.errors).map((e) => e.message);
  }

  if (err.name === "CastError") {
    status = 400;
    message = "Validation error";
    errors = [`Invalid ${err.path}`];
  }

  const payload = { message };
  if (errors) payload.errors = errors;
  res.status(status).json(payload);
};

module.exports = { notFound, errorHandler };
