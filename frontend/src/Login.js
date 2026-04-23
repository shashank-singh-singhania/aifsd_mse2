import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "./api";
import "./Auth.css";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const login = async () => {
    setError("");
    if (!data.email || !data.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/login", data);
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Lost & Found System</h2>
        <h3>Login</h3>
        {error && <p className="error">{error}</p>}
        <input 
          placeholder="Email" 
          type="email"
          value={data.email}
          onChange={e => setData({...data, email:e.target.value})}
          className="auth-input"
          onKeyPress={e => e.key === "Enter" && login()}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={data.password}
          onChange={e => setData({...data, password:e.target.value})}
          className="auth-input"
          onKeyPress={e => e.key === "Enter" && login()}
        />
        <button onClick={login} disabled={loading} className="auth-button">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}