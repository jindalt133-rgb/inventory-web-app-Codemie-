import { pool } from "../db.js";
import { ApiError } from "../errors/apiError.js";

// ✅ sTOCK IN (increase quantity + add history)
export const stockIn = async (req, res, next) => {
  const { product_id, qty, note } = req.body;

  try {
    // request validation handled by middleware

    // Check product exists
    const p = await pool.query("SELECT id FROM products WHERE id=$1", [product_id]);
    if (p.rows.length === 0) {
      return next(
        new ApiError({ status: 404, code: "NOT_FOUND", message: "Product not found" })
      );
    }

    // Update product quantity
    await pool.query("UPDATE products SET quantity = quantity + $1 WHERE id=$2", [qty, product_id]);

    // Insert movement history
    const movement = await pool.query(
      "INSERT INTO stock_movements(product_id, type, qty, note) VALUES($1, 'IN', $2, $3) RETURNING *",
      [product_id, qty, note ?? null]
    );

    res.json({ message: "Stock IN successful", movement: movement.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ✅ sTOCK OUT (decrease quantity + add history)
export const stockOut = async (req, res, next) => {
  const { product_id, qty, note } = req.body;

  try {
    // Check product + current stock
    const cur = await pool.query("SELECT quantity FROM products WHERE id=$1", [product_id]);
    if (cur.rows.length === 0) {
      return next(
        new ApiError({
          status: 404,
          code: "NOT_FOUND",
          message: "Product not found"
        })
      );
    }

    const currentQty = Number(cur.rows[0].quantity);
    if (currentQty < Number(qty)) {
      return next(
        new ApiError({
          status: 400,
          code: "VALIDATION_ERROR",
          message: "Not enough stock"
        })
      );
    }

    // Update product quantity
    await pool.query("UPDATE products SET quantity = quantity - $1 WHERE id=$2", [qty, product_id]);

    // Insert movement history
    const movement = await pool.query(
      "INSERT INTO stock_movements(product_id, type, qty, note) VALUES($1, 'OUT', $2, $3) RETURNING *",
      [product_id, qty, note ?? null]
    );

    res.json({ message: "Stock OUT successful", movement: movement.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ✅ sTOCK HISTORY (latest 200)
export const stockHistory = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT m.*, p.sku, p.name
      FROM stock_movements m
      JOIN products p ON p.id = m.product_id
      ORDER BY m.id DESC
      LIMIT 200
    `);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
