import React, { useState } from "react";
import feedbackImg from "../assets/feedback.jpg";

function Feedback() {

  const [rating, setRating] = useState(0);
  const [menuGood, setMenuGood] = useState(null);
  const [mood, setMood] = useState(null);
  const [diet, setDiet] = useState(null);
  const [healthIssues, setHealthIssues] = useState([]);
  const [showOther, setShowOther] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleHealth = (value) => {
    if (value === "Other") {
      setShowOther(!showOther);
    }

    if (healthIssues.includes(value)) {
      setHealthIssues(healthIssues.filter(item => item !== value));
    } else {
      setHealthIssues([...healthIssues, value]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your valuable feedback 💚");
  };

  return (
    <div className="feedback-wrap">

      {/* LEFT PANEL */}
      <div className="panel">
        <h3>We’d love your feedback 💚</h3>
        <p className="text-muted">Help us improve your daily mess meals.</p>

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
            {["😍","🙂","😐","😣"].map((m,index)=>(
              <button key={index}
                type="button"
                className={`mood-btn ${mood===m ? "active":""}`}
                onClick={()=>setMood(m)}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Diet */}
          <div className="mb-3">
            <label className="form-label fw-bold">Your diet preference</label><br/>
            {["Veg","Non-Veg","Vegan","Jain","High Protein"].map((d,index)=>(
              <button key={index}
                type="button"
                className={`diet-btn ${diet===d ? "active":""}`}
                onClick={()=>setDiet(d)}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Health Issues */}
          <div className="mb-3">
            <label className="form-label fw-bold">Health issues (if any)</label>
            <div>
              {["Stomach ache","Too oily","Allergy","Other"].map((item,index)=>(
                <div key={index}>
                  <input
                    type="checkbox"
                    onChange={()=>handleHealth(item)}
                  /> {item}
                </div>
              ))}
            </div>

            {showOther && (
              <textarea
                className="form-control mt-2"
                placeholder="Explain..."
              />
            )}
          </div>

          {/* Suggest Dish */}
          <div className="mb-3">
            <label className="form-label fw-bold">Suggest a dish</label>
            <input type="text" className="form-control"/>
          </div>

          {/* Additional Comments */}
          <div className="mb-3">
            <label className="form-label fw-bold">Additional comments</label>
            <textarea className="form-control"/>
          </div>

          {/* Photo */}
          <div className="mb-3">
            <label className="form-label fw-bold">Upload photo</label>
            <input type="file" className="form-control" onChange={handleImage}/>
            {preview && (
              <img src={preview} alt="preview" className="img-preview"/>
            )}
          </div>

          <button className="btn btn-success w-100 mt-2 submit-btn">
            Submit Feedback
          </button>

        </form>
      </div>

      {/* RIGHT SIDE */}
      <div className="side-card panel">
        <img src={feedbackImg} alt="feedback"/>
        <strong>Quick Tips</strong>
        <p className="text-muted mt-2">
          Be specific about dishes & meals. Your feedback helps improve the quality daily!
        </p>
      </div>

    </div>
  );
}

export default Feedback;