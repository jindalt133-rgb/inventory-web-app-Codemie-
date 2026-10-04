import { ApiError } from "../errors/apiError.js";

// Minimal validation helper: define rules per route
// rule shape: { in: 'body'|'params'|'query', key: 'string',
//              required?: bool, type?: 'string'|'number'|'email', min#� num, custom?: (v)=>bool }

function isEmpty(v) {
  return v === undefined || v === null || v === "";
}

function isNumericString(v) {
  if (typeof v === "number") return Number.isFinite(v);
  if (typeof v !== "string" && typeof v !== "number") return false;
  return String(v).trim() !== "" && Number.isFinite(Number(v));
}

function isEmail(v) {
  if (typeof v !== "string") return false;
  // minimal email check (no dependencies)
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
}

export function validate(rules) {
  return (req, res, next) => {
    for (const rule of rules) {
      const source = rule.in === "params" ? req.params : rule.in === "query" ? req.query : req.body;
      const value = source?.[rule.key];

      if (rule.required && isEmpty(value)) {
        return next(
          new ApiError({
            status: 400,
            code: "VALIDATION_ERROR",
            message: `${rule.key} is required`
          })
        );
      }

      if (!isEmpty(value) && rule.type === "number" && !isNumericString(value)) {
        return next(
          new ApiError({
            status: 400,
            code: "VALIDATION_ERROR",
            message: `${rule.key} must be a number`
          })
        );
      }

      if (!isEmpty(value) && rule.type === "email" && !isEmail(value)) {
        return next(
          new ApiError({
            status: 400,
            code: "VALIDATION_ERROR",
            message: `${rule.key} must be a valid email` 
          })
        );
      }

      if (!isEmpty(value) && typeof rule.min === "number" && isNumericString(value)) {
        const num = Number(value);
        if (num < rule.min) {
          return next(
            new ApiError({
              status: 400,
              code: "VALIDATION_ERROR",
              message: `${rule.key} must be greater than ${rule.min}`
            })
          );
        }
      }

      if (typeof rule.custom === "function" && !isEmpty(value)) {
        const ok = rule.custom(value, req);
        if (!ok) {
          return next(
            new ApiError({
              status: 400,
              code: "VALIDATION_ERROR",
              message: rule.message ?? `${rule.key} is invalid`
            })
          );
        }
      }
    }

    next();
  };
}
