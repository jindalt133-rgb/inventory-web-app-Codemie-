import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { stockIn, stockOut, stockHistory } from "../controllers/stockController.js";

const router = express.Router();

router.post("/in", verifyToken, stockIn);
router.post("/out", verifyToken, stockOut);
router.get("/history", verifyToken, stockHistory);

export default router;