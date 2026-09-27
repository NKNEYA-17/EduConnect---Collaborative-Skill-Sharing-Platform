import React from "react";

function Portfolio({ mentorData, handleChange }) {
  return (
    <div className="portfolio-section">

      {/* HEADER */}
      <h2 className="form-title">📁 Portfolio & Profile</h2>

      {/* SUBTITLE */}
      <p
        className="form-subtitle"
        style={{
          color: "rgba(148, 163, 184, 0.75)",
          marginBottom: "24px"
        }}
      >
        <span style={{ color: "rgba(148, 163, 184, 0.75)" }}>
          Showcase your professional presence with links and introduction.
        </span>
        <br />
        <span style={{ color: "rgba(148, 163, 184, 0.55)" }}>
          This helps others understand your experience better.
        </span>
      </p>

      {/* Portfolio Link */}
      <div className="input-group">
        <label className="field-label">Portfolio Link</label>

        <input
          className="form-input"
          type="text"
          name="portfolio"
          placeholder="https://your-portfolio.com"
          value={mentorData.portfolio || ""}
          onChange={handleChange}
        />
      </div>

      {/* LinkedIn */}
      <div className="input-group">
        <label className="field-label">LinkedIn Profile</label>

        <input
          className="form-input"
          type="text"
          name="linkedin"
          placeholder="https://linkedin.com/in/yourname"
          value={mentorData.linkedin || ""}
          onChange={handleChange}
        />
      </div>

      {/* Resume */}
      <div className="input-group">
        <label className="field-label">Resume Link</label>

        <input
          className="form-input"
          type="text"
          name="resume"
          placeholder="Google Drive / PDF link"
          value={mentorData.resume || ""}
          onChange={handleChange}
        />
      </div>

      {/* Bio */}
      <div className="input-group">
        <label className="field-label">Short Bio</label>

        <textarea
          className="form-textarea"
          name="bio"
          placeholder="Write a short introduction about yourself..."
          value={mentorData.bio || ""}
          onChange={handleChange}
          rows="4"
        />
      </div>

    </div>
  );
}

export default Portfolio;