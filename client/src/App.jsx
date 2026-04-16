import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import LowStock from "./pages/LowStock";
import Suppliers from "./pages/Suppliers";

function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "15px 25px",
          backgroundColor: "#2c3e50",
          alignItems: "center"
        }}
      >
        <Link to="/dashboard" style={{ color: "#ecf0f1", textDecoration: "none" }}>
          Dashboard
        </Link>

        <Link to="/products" style={{ color: "#ecf0f1", textDecoration: "none" }}>
          Products
        </Link>

        <Link to="/stock-in" style={{ color: "#ecf0f1", textDecoration: "none" }}>
          Stock IN
        </Link>

        <Link to="/stock-out" style={{ color: "#ecf0f1", textDecoration: "none" }}>
          Stock OUT
        </Link>

        <Link to="/history" style={{ color: "#ecf0f1", textDecoration: "none" }}>
          History
        </Link>

        <Link to="/low-stock" style={{ color: "#ecf0f1", textDecoration: "none" }}>
          Low Stock
        </Link>

        <Link to="/suppliers" style={{ color: "#ecf0f1", textDecoration: "none" }}>
        Suppliers
        </Link>


        <div style={{ marginLeft: "auto" }}>
          {user && (
            <span style={{ color: "#ecf0f1" }}>
              {user.name} ({user.role})
            </span>
          )}

          <button
            onClick={handleLogout}
            style={{
              marginLeft: 10,
              padding: "8px 14px",
              border: "none",
              backgroundColor: "#e74c3c",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock-in"
          element={
            <ProtectedRoute>
              <Layout>
                <StockIn />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock-out"
          element={
            <ProtectedRoute>
              <Layout>
                <StockOut />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <History />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/low-stock"
          element={
            <ProtectedRoute>
              <Layout>
                <LowStock />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
        path="/suppliers"
        element={
        <ProtectedRoute>
          <Layout>
            <Suppliers />
            </Layout>
            </ProtectedRoute>
          }
          />
          
</Routes>
    </BrowserRouter>
  );
}