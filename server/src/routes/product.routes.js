import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  lowStock
} from "../controllers/productController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const idParamRules = [{ in: "params", key: "id", required: true, type: "number" }];

const productBodyRules = [
  // Existing fields from current app: sku, name, category_id, price, quantity, reorder_level
  { in: "body", key: "sku", required: true },
  { in: "body", key: "name", required: true },
  { in: "body", key: "category_id", required: true, type: "number" },
  { in: "body", key: "price", required: true, type: "number" },
  { in: "body", key: "quantity", required: true, type: "number" },
  { in: "body", key: "reorder_level", required: true, type: "number" }
];

router.get("/", verifyToken, getProducts);

router.post("/", verifyToken, validate(productBodyRules), addProduct);

router.put("/:id", verifyToken, validate(idParamRules), validate(productBodyRules), updateProduct);

router.delete("/:id", verifyToken, validate(idParamRules), deleteProduct);

router.get("/low-stock", verifyToken, lowStock);

export default router;
