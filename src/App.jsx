import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Register from "./pages/Register";
import Feedback from "./pages/Feedback";
import About from "./pages/About";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;