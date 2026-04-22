import React from "react";
import logo from "../assets/logo.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow custom-navbar">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center brand-logo" to="/">
          <img src={logo} alt="logo" className="logo-img" />
          IIITL Mess
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/menu">Menu</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/feedback">Feedback</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/about">About</NavLink>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="nav-link user-badge">
                    👤 {user?.name?.split(" ")[0]}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="nav-link custom-link logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link custom-link auth-nav-btn login-nav" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link custom-link auth-nav-btn signup-nav" to="/signup">
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;