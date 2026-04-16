import express from "express";
import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier
} from "../controllers/supplierController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getSuppliers);
router.post("/", verifyToken, addSupplier);
router.put("/:id", verifyToken, updateSupplier);
router.delete("/:id", verifyToken, deleteSupplier);

export default router;