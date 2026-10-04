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

// No body-field validation here: the pre-existing productController never
// enforced required product fields, so none are invented here either
// (approved scope: numeric :id validation only for products).

router.get("/", verifyToken, getProducts);

router.post("/", verifyToken, addProduct);

router.put("/:id", verifyToken, validate(idParamRules), updateProduct);

router.delete("/:id", verifyToken, validate(idParamRules), deleteProduct);

router.get("/low-stock", verifyToken, lowStock);

export default router;
