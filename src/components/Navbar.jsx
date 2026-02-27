import React from "react";
import logo from "../assets/logo.jpg";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow custom-navbar">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center brand-logo" to="/">
          <img
            src={logo}
            alt="logo"
            className="logo-img"
          />
          IIITL Mess 
        </NavLink>

        <div>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/menu">Menu</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/register">Register</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/feedback">Feedback</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/about">About</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;