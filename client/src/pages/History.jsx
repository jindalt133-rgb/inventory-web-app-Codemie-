import { useEffect, useState } from "react";
import api from "../api/api";

export default function History() {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const res = await api.get("/stock/history");
    setHistory(res.data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Stock History</h2>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>SKU</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Note</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.type}</td>
              <td>{item.qty}</td>
              <td>{item.note}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}