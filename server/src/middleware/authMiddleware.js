import jwt from "jsonwebtoken";
import { ApiError } from "../errors/apiError.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(
      new ApiError({
        status: 401,
        code: "AUTH_REQUIRED",
        message: "Access denied. No token."
      })
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(
      new ApiError({
        status: 401,
        code: "AUTH_REQUIRED",
        message: "Invalid token"
      })
    );
  }
};
