import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {

  const navigate = useNavigate();

  const phrases = [
    "Learn Together...",
    "Teach Others...",
    "Grow Together...",
    "Connect Globally...",
    "Exchange Knowledge..."
  ];

  const [index, setIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {

    const typewriter = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2000);

    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    return () => {
      clearInterval(typewriter);
      clearTimeout(buttonTimer);
    };

  }, []);

  return (
    <div className="landing">

      {/* Floating Bubbles */}

      <div className="bubble react">⚛ React</div>
      <div className="bubble python">🐍 Python</div>
      <div className="bubble ai">🤖 AI</div>
      <div className="bubble guitar">🎸 Guitar</div>
      <div className="bubble photo">📸 Photography</div>
      <div className="bubble java">☕ Java</div>

      {/* Center Content */}

      <div className="center-box">

        <div className="brain">
          🧠
        </div>

        <h1 className="title">
          EduConnect
        </h1>

        <h2 className="subtitle">
          Learn. Teach. Grow Together.
        </h2>

        <p className="typewriter-text">
          {phrases[index]}
        </p>

        {showButton && (

          <button
            className="start-btn"
            onClick={() => navigate("/home")}
          >
            ✨ Explore
          </button>

        )}

      </div>

    </div>
  );
}

export default LandingPage;