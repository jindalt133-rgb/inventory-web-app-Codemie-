import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { stockIn, stockOut, stockHistory } from "../controllers/stockController.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const stockBodyRules = [
  { in: "body", key: "product_id", required: true, type: "number" },
  // current app uses `qty` field
  { in: "body", key: "qty", required: true, type: "number", min: 1 }
];

router.post("/in", verifyToken, validate(stockBodyRules), stockIn);

router.post("/out", verifyToken, validate(stockBodyRules), stockOut);

router.get("/history", verifyToken, stockHistory);

export default router;
