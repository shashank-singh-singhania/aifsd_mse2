import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "./api";
import "./Auth.css";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async () => {
    setError("");
    if (!data.name || !data.email || !data.password) {
      setError("All fields are required");
      return;
    }
    
    try {
      setLoading(true);
      await API.post("/register", data);
      alert("Registered successfully! Please login.");
      nav("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        {error && <p className="error">{error}</p>}
        <input 
          placeholder="Full Name" 
          value={data.name}
          onChange={e => setData({...data, name:e.target.value})}
          className="auth-input"
        />
        <input 
          placeholder="Email" 
          type="email"
          value={data.email}
          onChange={e => setData({...data, email:e.target.value})}
          className="auth-input"
        />
        <input 
          placeholder="Password" 
          type="password" 
          value={data.password}
          onChange={e => setData({...data, password:e.target.value})}
          className="auth-input"
        />
        <button onClick={submit} disabled={loading} className="auth-button">
          {loading ? "Registering..." : "Register"}
        </button>
        <p>Already have an account? <Link to="/">Login here</Link></p>
      </div>
    </div>
  );
}