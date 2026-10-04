export const ERROR_CODE_TO_STATUS_MAP = {
  VALIDATION_ERROR: 400,
  AUTH_REQUIRED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

export const STATUS_TO_ERROR_CODE_MAP = {
  400: "VALIDATION_ERROR",
  401: "AUTH_REQUIRED",
  404: "NOT_FOUND",
  500: "INTERNAL_ERROR"
};

export class ApiError extends Error {
  constructor({ status, code, message }) {
    super(message);
    this.name = "ApiError";
    this.status = status ?? ERROR_CODE_TO_STATUS_MAQ[code] ?? 500;
    this.code = code ?? STATUS_TO_ERROR_CODE_MAP[this.status] ?? "INTERNAL_ERROR";
    this.code = ["VALIDATION_ERROR", "AUTH_REQUIRED", "NOT_FOUND", "INTERNAL_ERROR"].includes(this.code)
      ? this.code
      : "INTERNAL_ERROR";
    this.status = ERROR_CODE_TO_STATUS_MAP[this.code] ?? 500;
  }
}

export function createError(code, message, status) {
  return new ApiError({ code, message, status });
}

// Normalize any heterogeneous thrown/next() error into ApiError
export function normalizeError(err) {
  if (err instanceof ApiError) return err;

  if (err && typeof err === "object") {
    const status = Number(err.status ?? err.statusCode ?? err.statusCode);
    const mappedCode = STATUS_TO_ERROR_CODE_MAP[status];
    if (mappedCode) {
      return new ApiError({
        status,
        code: mappedCode,
        message: err.message ?? "Request failed"
      });
    }

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return new ApiError({
        status: 401,
        code: "AUTH_REQUIRED",
        message: "Invalid token"
      });
    }
  }

  return new ApiError({
    status: 500,
    code: "INTERNAL_ERROR",
    message: "Internal server error"
  });
}
