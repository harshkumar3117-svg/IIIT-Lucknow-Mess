import React from "react";

function MealCard({ image, title, time }) {
  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100">
        
        <img
          src={image}
          alt={title}
          className="meal-img mb-3"
        />

        <div className="card-body text-center">
          <h5 className="meal-title">{title}</h5>
          <p className="meal-time">🕒 {time}</p>
        </div>

      </div>
    </div>
  );
}

export default MealCard;