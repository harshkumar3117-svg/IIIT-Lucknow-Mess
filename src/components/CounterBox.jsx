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
    <div className="col-md-4">
      <div className="card text-center p-4 shadow">
        <h2 className="text-success">{count}+</h2>
        <p>{label}</p>
      </div>
    </div>
  );
}

export default CounterBox;