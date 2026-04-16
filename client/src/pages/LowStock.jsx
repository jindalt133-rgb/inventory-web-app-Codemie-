import { useEffect, useState } from "react";
import api from "../api/api";

export default function LowStock() {
  const [products, setProducts] = useState([]);

  const loadLowStockProducts = async () => {
    try {
      const res = await api.get("/products");

      const lowStock = res.data.filter(
        (p) => Number(p.quantity) <= Number(p.reorder_level)
      );

      setProducts(lowStock);
    } catch (error) {
      console.error("Failed to load low stock products:", error);
    }
  };

  useEffect(() => {
    loadLowStockProducts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Low Stock Products</h2>

      {products.length === 0 ? (
        <p>No low stock products.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>SKU</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Reorder Level</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>{p.reorder_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}