import { useEffect, useState } from "react";
import api from "../api/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    sku: "",
    name: "",
    price: "",
    quantity: "",
    reorder_level: ""
  });
  const [editingId, setEditingId] = useState(null);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products:", error);
      setError("Failed to load products.");
    }
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

  const resetForm = () => {
    setForm({
      sku: "",
      name: "",
      price: "",
      quantity: "",
      reorder_level: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        sku: form.sku,
        name: form.name,
        category_id: null,
        price: Number(form.price),
        quantity: Number(form.quantity),
        reorder_level: Number(form.reorder_level)
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage("Product updated successfully.");
      } else {
        await api.post("/products", payload);
        setMessage("Product added successfully.");
      }

      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
      setError("Failed to save product.");
    }
  };

  const handleEdit = (product) => {
    setMessage("");
    setError("");
    setEditingId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      reorder_level: product.reorder_level
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/products/${id}`);
      if (editingId === id) {
        resetForm();
      }
      setMessage("Product deleted successfully.");
      loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      setError("Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>

      <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: 10, padding: 10, width: 300 }}
        />

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: 10, padding: 10, width: 300 }}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: 10, padding: 10, width: 300 }}
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: 10, padding: 10, width: 300 }}
        />

        <input
          type="number"
          name="reorder_level"
          placeholder="Reorder Level"
          value={form.reorder_level}
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: 10, padding: 10, width: 300 }}
        />

        <button
          type="submit"
          style={{
            padding: "8px 14px",
            marginRight: 10,
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: "8px 14px",
              border: "none",
              backgroundColor: "#7f8c8d",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {message && (
        <p
          style={{
            color: "green",
            marginBottom: 15,
            fontWeight: "500"
          }}
        >
          {message}
        </p>
      )}

      {error && (
        <p
          style={{
            color: "red",
            marginBottom: 15,
            fontWeight: "500"
          }}
        >
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Search by name or SKU..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 20,
          width: "300px"
        }}
      />

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px"
        }}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>ID</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>SKU</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>Name</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>Price</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>Quantity</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>Reorder Level</th>
            <th style={{ backgroundColor: "#f4f4f4", color: "#000" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>{p.reorder_level}</td>
              <td>
                <button
                  onClick={() => handleEdit(p)}
                  style={{
                    marginRight: 8,
                    padding: "8px 14px",
                    border: "none",
                    backgroundColor: "#3498db",
                    color: "white",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    padding: "8px 14px",
                    border: "none",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}