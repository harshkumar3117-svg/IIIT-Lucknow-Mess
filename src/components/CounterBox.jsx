import React, { useState, useEffect } from "react";

function CounterBox({ label, endValue }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += Math.ceil(endValue / 40);
      if (start >= endValue) {
        start = endValue;
        clearInterval(interval);
      }
      setCount(start);
    }, 50);
  }, [endValue]);

  return (
    <div className="col-md-4 mb-4 d-flex">
      <div className="card w-100 text-center p-4 shadow d-flex flex-column justify-content-center">
        <h2 className="text-success mb-3">{count}+</h2>
        <p className="mb-0">{label}</p>
      </div>
    </div>
  );
}

export default CounterBox;