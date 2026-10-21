import { ApiError } from "../errors/apiError.js";

// Minimal validation helper: define rules per route
// rule shape: { in: 'body'|'params'|'query', key: 'string',
//              required?: bool, allowNull?: bool (key must be present; explicit null accepted), type?: 'string'|'number', min?: number, custom?: (v)=>bool }

function isEmpty(v) {
  return v === undefined || v === null || v === "";
}

function isNumericString(v) {
  if (typeof v === "number") return Number.isFinite(v);
  if (typeof v !== "string" && typeof v !== "number") return false;
  return String(v).trim() !== "" && Number.isFinite(Number(v));
}

export function validate(rules) {
  return (req, res, next) => {
    for (const rule of rules) {
      const source = rule.in === "params" ? req.params : rule.in === "query" ? req.query : req.body;
      const value = source?.[rule.key];

      const explicitNull = rule.allowNull === true && value === null;

      if (rule.required && isEmpty(value) && !explicitNull) {
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

      if (!isEmpty(value) && typeof rule.min === "number" && isNumericString(value)) {
        const num = Number(value);
        if (num < rule.min) {
          return next(
            new ApiError({
              status: 400,
              code: "VALIDATION_ERROR",
              message: `${rule.key} must be at least ${rule.min}`
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
