import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js"; // ✅ add this

import productRoutes from "./routes/product.routes.js";

import stockRoutes from "./routes/stock.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// authRoutes
app.use("/api/auth", authRoutes);
// productRoutes
app.use("/api/products", productRoutes);
// stockRoutes
app.use("/api/stock", stockRoutes);
//supplierRoutes
app.use("/api/suppliers", supplierRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Inventory API running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});