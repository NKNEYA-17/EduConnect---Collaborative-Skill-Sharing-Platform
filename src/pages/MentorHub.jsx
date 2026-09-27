import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/MentorHub.css";

function MentorHub() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: "💰",
      title: "Earn While Teaching",
      text: "Turn your expertise into income by mentoring learners from anywhere."
    },
    {
      icon: "🌍",
      title: "Global Community",
      text: "Connect with students and professionals from around the world."
    },
    {
      icon: "⭐",
      title: "Build Your Reputation",
      text: "Receive reviews, ratings, and grow your professional profile."
    },
    {
      icon: "📅",
      title: "Flexible Schedule",
      text: "Choose your own availability and teach whenever you want."
    }
  ];

  return (
    <>
      <Navbar />

      <div className="mentorhub">

        {/* Hero Section */}
        <section className="mentor-hero">

          <h1>Become an EduConnect Mentor</h1>

          <p>
            Inspire learners, share your expertise, and make a meaningful
            impact while building your professional profile.
          </p>

          <button
            className="apply-btn"
            onClick={() => navigate("/mentor-application")}
          >
            🚀 Apply as Mentor
          </button>

        </section>

        {/* Statistics */}
        <section className="mentor-stats">

          <div className="stat-card">
            <h2>500+</h2>
            <p>Active Mentors</p>
          </div>

          <div className="stat-card">
            <h2>5K+</h2>
            <p>Learners</p>
          </div>

          <div className="stat-card">
            <h2>10K+</h2>
            <p>Sessions Conducted</p>
          </div>

        </section>

        {/* Benefits */}
        <section className="benefits">

          <h2>Why Mentor with EduConnect?</h2>

          <div className="benefit-grid">

            {benefits.map((item, index) => (
              <div className="benefit-card" key={index}>

                <div className="benefit-icon">{item.icon}</div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

              </div>
            ))}

          </div>

        </section>

      </div>
    </>
  );
}

export default MentorHub;