import React, { useState } from "react";
import "/src/index.css";

const menuData = {
  Sunday: {
    breakfast: "Aloo Paratha, Curd, Pickle",
    lunch: "Paneer Butter Masala, Rice, Salad",
    snacks: "Samosa, Tea",
    dinner: "Dal Makhani, Roti, Jeera Rice"
  },
  Monday: {
    breakfast: "Poha, Tea, Banana",
    lunch: "Rajma Chawal, Salad",
    snacks: "Bread Pakora, Tea",
    dinner: "Mix Veg, Roti, Dal"
  },
  Tuesday: {
    breakfast: "Idli, Sambhar, Coconut Chutney",
    lunch: "Kadhi Chawal, Papad",
    snacks: "Biscuit, Tea",
    dinner: "Chole, Rice, Salad"
  },
  Wednesday: {
    breakfast: "Aloo Puri, Pickle",
    lunch: "Dal Fry, Rice, Roti",
    snacks: "Namkeen, Tea",
    dinner: "Aloo Gobi, Roti"
  },
  Thursday: {
    breakfast: "Upma, Tea",
    lunch: "Masoor Dal, Roti",
    snacks: "Cutlet, Tea",
    dinner: "Palak Paneer, Rice"
  },
  Friday: {
    breakfast: "Sandwich, Tea",
    lunch: "Kadhi Pakoda, Rice",
    snacks: "French Fries, Tea",
    dinner: "Aloo Beans, Rice"
  },
  Saturday: {
    breakfast: "Paratha, Tea",
    lunch: "Chole Bhature, Salad",
    snacks: "Pasta, Tea",
    dinner: "Dal Tadka, Roti"
  }
};

const meals = ["all", "breakfast", "lunch", "snacks", "dinner"];

function Menu() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="menu-container">
      <h2 className="menu-title">🌿 Weekly Mess Menu</h2>

      <div className="filter-section">
        {meals.map((type) => (
          <button
            key={type}
            className={`filter-btn ${filter === type ? "active-btn" : ""}`}
            onClick={() => setFilter(type)}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {Object.keys(menuData).map((day) => (
          <div className="menu-card" key={day}>
            <h4>{day}</h4>
            <hr />

            {(filter === "all" || filter === "breakfast") && (
              <p><strong>Breakfast:</strong> {menuData[day].breakfast}</p>
            )}

            {(filter === "all" || filter === "lunch") && (
              <p><strong>Lunch:</strong> {menuData[day].lunch}</p>
            )}

            {(filter === "all" || filter === "snacks") && (
              <p><strong>Snacks:</strong> {menuData[day].snacks}</p>
            )}

            {(filter === "all" || filter === "dinner") && (
              <p><strong>Dinner:</strong> {menuData[day].dinner}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;