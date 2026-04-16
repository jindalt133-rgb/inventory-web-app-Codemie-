import { pool } from "../db.js";

export const getProducts = async (req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
  res.json(result.rows);
};

export const addProduct = async (req, res) => {
  const { sku, name, category_id, price, quantity, reorder_level } = req.body;

  const result = await pool.query(
    `INSERT INTO products (sku,name,category_id,price,quantity,reorder_level)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [sku, name, category_id, price, quantity, reorder_level]
  );

  res.json(result.rows[0]);
};

export const updateProduct = async (req, res) => {

  const id = req.params.id;
  const { sku, name, category_id, price, quantity, reorder_level } = req.body;

  const result = await pool.query(
    `UPDATE products
     SET sku=$1,name=$2,category_id=$3,price=$4,quantity=$5,reorder_level=$6
     WHERE id=$7
     RETURNING *`,
    [sku, name, category_id, price, quantity, reorder_level, id]
  );

  res.json(result.rows[0]);
};

export const deleteProduct = async (req, res) => {

  const id = req.params.id;

  await pool.query("DELETE FROM products WHERE id=$1", [id]);

  res.json({ message: "Product deleted" });
};

export const lowStock = async (req, res) => {

  const result = await pool.query(
    `SELECT * FROM products WHERE quantity <= reorder_level`
  );

  res.json(result.rows);
};