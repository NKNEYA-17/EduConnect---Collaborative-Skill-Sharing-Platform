import React from "react";

function MentorSkills({ mentorData, handleChange }) {
  const skillOptions = [
    "Java",
    "Python",
    "JavaScript",
    "React",
    "Node.js",
    "Spring Boot",
    "C++",
    "SQL",
    "HTML",
    "CSS",
  ];

  const handleSkillClick = (skill) => {
    const updatedSkills = mentorData.skills.includes(skill)
      ? mentorData.skills.filter((s) => s !== skill)
      : [...mentorData.skills, skill];

    handleChange({
      target: {
        name: "skills",
        value: updatedSkills,
      },
    });

    if (!mentorData.primarySkill) {
      handleChange({
        target: {
          name: "primarySkill",
          value: skill,
        },
      });
    }
  };

  return (
    <div className="form-section">

      {/* HEADER */}
      <h2 className="form-title">🧠 Skills & Expertise</h2>

      {/* SUBTITLE (LIGHTER UPDATED) */}
      <p
        className="form-subtitle"
        style={{ color: "rgba(148, 163, 184, 0.75)" }}
      >
        <span style={{ color: "rgba(148, 163, 184, 0.75)" }}>
          Select your technical skills and highlight your primary expertise.
        </span>
        <br />
        <span style={{ color: "rgba(148, 163, 184, 0.55)" }}>
          This helps learners find you easily.
        </span>
      </p>

      {/* SKILLS SECTION */}
      <div className="skills-container" style={{ marginTop: "18px" }}>
        <label className="field-label">Select Your Skills</label>

        <div className="skills-grid">
          {skillOptions.map((skill) => {
            const isSelected = mentorData.skills.includes(skill);
            const isPrimary = mentorData.primarySkill === skill;

            return (
              <button
                key={skill}
                type="button"
                className={`skill-btn ${isSelected ? "active" : ""} ${
                  isPrimary ? "primary" : ""
                }`}
                onClick={() => handleSkillClick(skill)}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRIMARY EXPERTISE */}
      <div className="input-group">
        <label className="field-label">Primary Expertise</label>

        <input
          className="form-input"
          type="text"
          name="primarySkill"
          placeholder="Enter your expertise"
          value={mentorData.primarySkill || ""}
          onChange={handleChange}
        />
      </div>

      {/* LANGUAGES */}
      <div className="input-group">
        <label className="field-label">Languages Known</label>

        <input
          className="form-input"
          type="text"
          name="languages"
          placeholder="English, Tamil"
          value={mentorData.languages || ""}
          onChange={handleChange}
        />
      </div>

    </div>
  );
}

export default MentorSkills;