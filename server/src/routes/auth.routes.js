import express from "express";
import { register, login } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/register",
  validate([
    { in: "body", key: "name", required: true },
    { in: "body", key: "email", required: true, type: "email" },
    { in: "body", key: "password", required: true },
    { in: "body", key: "role", required: true }
  ]),
  register
);

router.post(
  "/login",
  validate([
    { in: "body", key: "email", required: true, type: "email" },
    { in: "body", key: "password", required: true }
  ]),
  login
);

export default router;
