import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";

dotenv.config();

const app = express();

/* ================= CORS CONFIG ================= */
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://inventory-frontend-six-lemon.vercel.app/" // 🔥 replace with YOUR actual Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true
  })
);
/* ============================================== */

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/suppliers", supplierRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Inventory API running" });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});