import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import logo from "../assets/logo.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-form-side">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Login to your IIITL Mess account</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="your.email@iiitl.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 auth-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{" "}
              <NavLink to="/signup" className="auth-link">
                Sign Up
              </NavLink>
            </p>
          </div>

          <div className="auth-image-side">
            <img src={logo} alt="IIITL Mess" />
            <h3>IIITL Mess</h3>
            <p>Your daily dining companion</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
