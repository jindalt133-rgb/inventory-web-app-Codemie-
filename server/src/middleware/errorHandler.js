import { normalizeError } from "../errors/apiError.js";

export function apiNotFound(req, res, next) {
  // Only catch unknown /api/* routes
  next({ status: 404, code: "NOT_FOUND", message: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  const apiErr = normalizeError(err);

  const status = apiErr.status ?? 500;
  const code = apiErr.code ?? "INTERNAL_ERROR";

  // Never expose internal details
  const message = code === "INTERNAL_ERROR" ? "Internal server error" : (apiErr.message ?# add safe default message
    apiErr.message
    : "Request failed");

  res.status(status).json({
    error: {
      code,
      message
    }
  });
}
