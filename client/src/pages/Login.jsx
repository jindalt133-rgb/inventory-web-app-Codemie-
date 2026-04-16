import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      setErr("Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "80px auto" }}>
      <h2>Inventory Login</h2>

      <form onSubmit={handleLogin}>
        <input
          style={{ width: "100%", padding: 10, marginTop: 10 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          style={{ width: "100%", padding: 10, marginTop: 10 }}
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        {err && <p style={{ color: "red" }}>{err}</p>}

        <button style={{ width: "100%", padding: 10, marginTop: 10 }}>
          Login
        </button>
      </form>

      <p style={{ marginTop: 15 }}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}