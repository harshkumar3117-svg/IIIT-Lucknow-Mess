import React, { useState, useRef } from "react";
import feedbackImg from "../assets/feedback.jpg";
import API_BASE from "../api";

function Feedback() {
  const [rating, setRating] = useState(0);
  const [menuGood, setMenuGood] = useState(null);
  const [mood, setMood] = useState(null);
  const [diet, setDiet] = useState(null);
  const [healthIssues, setHealthIssues] = useState([]);
  const [showOther, setShowOther] = useState(false);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // "success" | "error"
  const [statusMsg, setStatusMsg] = useState("");

  const otherRef = useRef(null);
  const dishRef = useRef(null);
  const commentsRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleHealth = (value) => {
    if (value === "Other") setShowOther((prev) => !prev);
    setHealthIssues((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      rating,
      menuGood,
      mood,
      diet,
      healthIssues,
      otherHealthIssue: otherRef.current?.value || "",
      suggestedDish: dishRef.current?.value || "",
      comments: commentsRef.current?.value || "",
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus("success");
        setStatusMsg(data.message || "Thank you for your valuable feedback 💚");
        // Reset form
        setRating(0);
        setMenuGood(null);
        setMood(null);
        setDiet(null);
        setHealthIssues([]);
        setShowOther(false);
        setPreview(null);
        if (dishRef.current) dishRef.current.value = "";
        if (commentsRef.current) commentsRef.current.value = "";
        if (otherRef.current) otherRef.current.value = "";
      } else {
        setSubmitStatus("error");
        setStatusMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setSubmitStatus("error");
      setStatusMsg("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-wrap">

      {/* LEFT PANEL */}
      <div className="panel">
        <h3>We'd love your feedback 💚</h3>
        <p className="text-muted">Help us improve your daily mess meals.</p>

        {/* Status Banner */}
        {submitStatus === "success" && (
          <div className="alert-success-banner">
            ✅ {statusMsg}
          </div>
        )}
        {submitStatus === "error" && (
          <div className="alert-error-banner">
            ❌ {statusMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Star Rating */}
          <div className="mb-3">
            <label className="form-label fw-bold">Rate today's food</label><br/>
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? "active" : ""}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          {/* Yes No */}
          <div className="mb-3">
            <label className="form-label fw-bold">Was the menu good?</label><br/>
            <button type="button"
              className={`yn-btn yn-yes ${menuGood === "yes" ? "active-yn" : ""}`}
              onClick={() => setMenuGood("yes")}
            >👍 Yes</button>
            <button type="button"
              className={`yn-btn yn-no ${menuGood === "no" ? "active-yn" : ""}`}
              onClick={() => setMenuGood("no")}
            >👎 No</button>
          </div>

          {/* Mood */}
          <div className="mb-3">
            <label className="form-label fw-bold">How did the food make you feel?</label><br/>
            {["😍","🙂","😐","😣"].map((m, index) => (
              <button key={index}
                type="button"
                className={`mood-btn ${mood === m ? "active" : ""}`}
                onClick={() => setMood(m)}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Diet */}
          <div className="mb-3">
            <label className="form-label fw-bold">Your diet preference</label><br/>
            {["Veg","Non-Veg","Vegan","Jain","High Protein"].map((d, index) => (
              <button key={index}
                type="button"
                className={`diet-btn ${diet === d ? "active" : ""}`}
                onClick={() => setDiet(d)}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Health Issues */}
          <div className="mb-3">
            <label className="form-label fw-bold">Health issues (if any)</label>
            <div>
              {["Stomach ache","Too oily","Allergy","Other"].map((item, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    checked={healthIssues.includes(item)}
                    onChange={() => handleHealth(item)}
                  /> {item}
                </div>
              ))}
            </div>
            {showOther && (
              <textarea
                ref={otherRef}
                className="form-control mt-2"
                placeholder="Explain..."
              />
            )}
          </div>

          {/* Suggest Dish */}
          <div className="mb-3">
            <label className="form-label fw-bold">Suggest a dish</label>
            <input ref={dishRef} type="text" className="form-control"/>
          </div>

          {/* Additional Comments */}
          <div className="mb-3">
            <label className="form-label fw-bold">Additional comments</label>
            <textarea ref={commentsRef} className="form-control"/>
          </div>

          {/* Photo */}
          <div className="mb-3">
            <label className="form-label fw-bold">Upload photo</label>
            <input type="file" className="form-control" onChange={handleImage}/>
            {preview && (
              <img src={preview} alt="preview" className="img-preview"/>
            )}
          </div>

          <button
            className="btn btn-success w-100 mt-2 submit-btn"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>

        </form>
      </div>

      {/* RIGHT SIDE */}
      <div className="side-card panel">
        <img src={feedbackImg} alt="feedback"/>
        <strong>Quick Tips</strong>
        <p className="text-muted mt-2">
          Be specific about dishes &amp; meals. Your feedback helps improve the quality daily!
        </p>
      </div>

    </div>
  );
}

export default Feedback;