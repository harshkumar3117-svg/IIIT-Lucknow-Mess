import React from "react";
import aboutImg from "../assets/about4.jpg";
import CounterBox from "../components/CounterBox";

function Slideshow() {
  const facts = [
    "70% students prefer chapati over rice in dinner.",
    "Mess waste reduced by 22% in 2024.",
    "Paneer dishes are the most loved items.",
    "Upma and Poha are top breakfast choices."
  ];

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % facts.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="col-md-4 mb-4">
      <div className="react-box">
        <h6 className="fun-title">Fun Fact</h6>
        <p>{facts[index]}</p>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="container my-5">
      <div className="hero">
        <div className="hero-info">
          <h1>About IIITL Mess</h1>
          <p>
            The IIIT Lucknow Mess is a student-centric dining system focused on hygiene, taste,
            balanced nutrition, and transparency.
          </p>

          <div>
            <span className="pill">Hygienic Kitchen</span>
            <span className="pill">Weekly Menu Rotation</span>
            <span className="pill">Eco-Friendly</span>
            <span className="pill">Student Feedback Driven</span>
          </div>
        </div>

        <div className="hero-image">
          <img src={aboutImg} alt="Mess" />
        </div>
      </div>

      {/* GLASS CARD */}
      <div className="glass-card">
        <h4 className="philosophy-title">Our Philosophy</h4>
        <p>
          We believe a campus mess is not just a food facility — it is a daily experience.
          Our mission is to deliver meals that satisfy, energize, and promote good health.
        </p>
      </div>

      {/* STATS SECTION */}
      <h3 className="highlight-title text-center mt-5">
        IIITL Mess Highlights
      </h3>

      <div className="row justify-content-center mt-4">
        <CounterBox label="Meals Served Weekly" endValue={3500} />
        <CounterBox label="Students Registered" endValue={1200} />
        <Slideshow />
      </div>

    </div>
  );
}

export default About;