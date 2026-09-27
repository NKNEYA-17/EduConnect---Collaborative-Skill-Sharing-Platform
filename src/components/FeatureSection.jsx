import "../styles/FeatureSection.css";

function FeatureSection() {
  const features = [
    {
      icon: "📚",
      title: "Learn Skills",
      description:
        "Discover new skills from experienced mentors and fellow learners."
    },

    {
      icon: "👨‍🏫",
      title: "Teach Others",
      description:
        "Share your knowledge, inspire others, and become a mentor."
    },

    {
      icon: "📅",
      title: "Book Sessions",
      description:
        "Schedule one-to-one or group learning sessions with ease."
    },

    {
      icon: "📂",
      title: "Share Resources",
      description:
        "Upload notes, videos, PDFs, and learning materials."
    },

    {
      icon: "🤝",
      title: "Join Communities",
      description:
        "Connect with learners who share your interests and collaborate together."
    },

    {
      icon: "💥",
      title: "Failures Portfolio",
      description:
        "Share failed projects, lessons learned, and growth stories to inspire others."
    }
  ];

  return (
    <section className="features">

      <h2>Why Choose EduConnect?</h2>

      <div className="feature-grid">

        {features.map((feature, index) => (
          <div className="feature-card" key={index}>

            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default FeatureSection;