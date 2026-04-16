import { useEffect, useState } from "react";
import api from "../api/api";

export default function StockIn() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    qty: "",
    note: ""
  });
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/stock/in", {
        product_id: Number(form.product_id),
        qty: Number(form.qty),
        note: form.note
      });

      setMessage("Stock added successfully");

      setForm({
        product_id: "",
        qty: "",
        note: ""
      });

      loadProducts();
    } catch (error) {
      setMessage("Failed to add stock");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Stock IN</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>Product</label>
        <select
          name="product_id"
          value={form.product_id}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku}) - Current Qty: {p.quantity}
            </option>
          ))}
        </select>

        <label>Quantity</label>
        <input
          type="number"
          name="qty"
          value={form.qty}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }}
        />

        <label>Note</label>
        <input
          type="text"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Optional note"
          style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button type="submit" style={{ padding: "10px 20px" }}>
          Add Stock
        </button>
      </form>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  );
}