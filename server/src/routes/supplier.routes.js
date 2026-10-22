import express from "express";
import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier
} from "../controllers/supplierController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const idParamRules = [{ in: "params", key: "id", required: true, type: "number" }];

const supplierBodyRules = [
  // Require name only per approved requirement.
  { in: "body", key: "name", required: true }
  // phone/email/address are optional (no validation rules)
];

router.get("/", verifyToken, getSuppliers);

router.post("/", verifyToken, validate(supplierBodyRules), addSupplier);

router.put("/:id", verifyToken, validate(idParamRules), validate(supplierBodyRules), updateSupplier);

router.delete("/:id", verifyToken, validate(idParamRules), deleteSupplier);

export default router;
