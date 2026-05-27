import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import logo from "../assets/logo.jpg";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    enrollment: "",
    program: "",
    branch: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const enrollmentRegex = /^(LCS|LIT|LCI|LCB)\d{4}(00[1-9]|0[1-5][0-9]|060)$/i;
    if (!enrollmentRegex.test(formData.enrollment)) {
      setError("Invalid Enrollment Format. Example: LCI2024001");
      return;
    }

    const emailRegex = /^(lcs|lit|lci|lcb)\d{4}(00[1-9]|0[1-5][0-9]|060)@iiitl\.ac\.in$/i;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid Email Format. Example: lcs2025002@iiitl.ac.in");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/auth/signup", {
        name: formData.name,
        enrollment: formData.enrollment,
        program: formData.program,
        branch: formData.branch,
        email: formData.email,
        password: formData.password,
      });

      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-form-side">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Register for IIITL Mess</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="auth-field">
                    <label>Full Name</label>
                    <input
                      name="name"
                      className="form-control"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="auth-field">
                    <label>Enrollment No.</label>
                    <input
                      name="enrollment"
                      className="form-control"
                      placeholder="LCI2024001"
                      value={formData.enrollment}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="auth-field">
                    <label>Program</label>
                    <select
                      name="program"
                      className="form-select"
                      value={formData.program}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option>B.Tech</option>
                      <option>M.Tech</option>
                      <option>MBA</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="auth-field">
                    <label>Branch</label>
                    <select
                      name="branch"
                      className="form-select"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option>CSE</option>
                      <option>IT</option>
                      <option>ECE</option>
                    </select>
                  </div>
                </div>

                <div className="col-12">
                  <div className="auth-field">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="lcs2025002@iiitl.ac.in"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="auth-field">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Min 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="auth-field">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 auth-btn"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </button>
                </div>
              </div>
            </form>

            <p className="auth-switch">
              Already have an account?{" "}
              <NavLink to="/login" className="auth-link">
                Login
              </NavLink>
            </p>
          </div>

          <div className="auth-image-side">
            <img src={logo} alt="IIITL Mess" />
            <h3>IIITL Mess</h3>
            <p>Join the community</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
