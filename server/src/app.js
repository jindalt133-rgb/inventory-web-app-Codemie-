import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { apiNotFound } from "./middleware/errorHandler.js";

export function createApp(opts = {}) {
  const app = express();

  const allowedOrigins = opts.allowedOrigins ?? [
    "http://localhost:5173",
    "https://inventory-frontend-six-lemon.vercel.app"
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );

  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/stock", stockRoutes);
  app.use("/api/suppliers", supplierRoutes);

  // non-api health
  app.get("/", (req, res) => {
    res.json({ message: "Inventory API running" });
  });

  // explicit api 404
  app.use("/api", apiNotFound);

  // centralized error handler (must be last)
  app.use(errorHandler);

  return app;
}
