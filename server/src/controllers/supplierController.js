import { pool } from "../db.js";

export const getSuppliers = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM suppliers ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const addSupplier = async (req, res, next) => {
  const { name, phone, email, address } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO suppliers (name, phone, email, address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, phone, email, address]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateSupplier = async (req, res, next) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;

  try {
    const result = await pool.query(
      `UPDATE suppliers
       SET name = $1, phone = $2, email = $3, address = $4
       WHERE id = $5
       RETURNING *`,
      [name, phone, email, address, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteSupplier = async (req, res, next) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM suppliers WHERE id = $1", [id]);
    res.json({ message: "Supplier deleted successfully" });
  } catch (err) {
    next(err);
  }
};
