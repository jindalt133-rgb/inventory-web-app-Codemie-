import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  lowStock
} from "../controllers/productController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getProducts);

router.post("/", verifyToken, addProduct);

router.put("/:id", verifyToken, updateProduct);

router.delete("/:id", verifyToken, deleteProduct);

router.get("/low-stock", verifyToken, lowStock);

export default router;