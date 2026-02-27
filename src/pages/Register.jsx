import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.jpg";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    enrollment: "",
    program: "",
    branch: "",
    email: "",
    hostel: "",
    medicalNotes: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // 🔥 Sirf ye 5 fields backend ko bhej rahe hain
      const dataToSend = {
        name: formData.name,
        enrollment: formData.enrollment,
        program: formData.program,
        branch: formData.branch,
        email: formData.email
      };

      await axios.post(
        "/register",
        dataToSend
      );

      setMessage("✅ Registration Successful!");

      setFormData({
        name: "",
        enrollment: "",
        program: "",
        branch: "",
        email: "",
        hostel: "",
        medicalNotes: ""
      });

    } catch (error) {
      console.error(error);
      setMessage("❌ Error saving data");
    }
  };

  return (
    <div className="container my-5">
      <div className="card-register">

        <div className="hero-side">
          <h2>Student Registration</h2>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit} className="mt-3">
            <div className="row g-3">

              <div className="col-md-6">
                <label>Full Name</label>
                <input
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label>Enrollment No.</label>
                <input
                  name="enrollment"
                  className="form-control"
                  value={formData.enrollment}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
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

              <div className="col-md-6">
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

              <div className="col-md-6">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Optional fields (DB me save nahi honge) */}

              <div className="col-md-6">
                <label>Hostel / Room (Optional)</label>
                <input
                  name="hostel"
                  className="form-control"
                  value={formData.hostel}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label>Medical Notes (Optional)</label>
                <input
                  name="medicalNotes"
                  className="form-control"
                  value={formData.medicalNotes}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 d-grid">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>

            </div>
          </form>
        </div>

        <div className="image-side">
          <img src={logo} alt="register" />
        </div>

      </div>
    </div>
  );
}

export default Register;