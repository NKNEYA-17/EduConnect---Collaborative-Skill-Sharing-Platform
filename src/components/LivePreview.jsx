function LivePreview({ mentorData }) {

  const getInitials = () => {
    if (!mentorData.fullName) return "👤";

    const names = mentorData.fullName.trim().split(" ");

    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }

    return (
      names[0][0].toUpperCase() +
      names[names.length - 1][0].toUpperCase()
    );
  };

  return (
    <div className="preview-card">

      <h2>Live Preview</h2>

      {/* AVATAR */}
      <div className="avatar">
        {mentorData.profilePhoto ? (
          <img src={mentorData.profilePhoto} alt="Profile" />
        ) : (
          <div className="initials">{getInitials()}</div>
        )}
      </div>

      <h3>{mentorData.fullName || "Your Name"}</h3>

      <p>📧 {mentorData.email || "your@email.com"}</p>
      <p>📱 {mentorData.phone || "9876543210"}</p>

      <p>
        📍 {mentorData.city || "City"}
        {mentorData.country ? `, ${mentorData.country}` : ""}
      </p>

      <hr />

      {/* EDUCATION */}
      <h4>🎓 Education</h4>
      <p><strong>Degree:</strong> {mentorData.degree || "-"}</p>
      <p><strong>University:</strong> {mentorData.university || "-"}</p>
      <p><strong>Graduation:</strong> {mentorData.graduationYear || "-"}</p>

      <hr />

      {/* EXPERIENCE */}
      <h4>💼 Experience</h4>
      <p><strong>Profession:</strong> {mentorData.profession || "-"}</p>
      <p>
        <strong>Experience:</strong>{" "}
        {mentorData.experience ? `${mentorData.experience} Years` : "-"}
      </p>

      <hr />

      {/* SKILLS */}
      <h4>🧠 Skills</h4>

      <p>
        <strong>Primary Skill:</strong>{" "}
        {mentorData.primarySkill || "-"}
      </p>

      <p>
        <strong>Languages:</strong>{" "}
        {mentorData.languages || "-"}
      </p>

      <div className="skills-preview">
        {mentorData.skills && mentorData.skills.length > 0 ? (
          mentorData.skills.map((skill, index) => (
            <span key={index} className="skill-chip">
              {skill}
            </span>
          ))
        ) : (
          <span>-</span>
        )}
      </div>

      <hr />

      {/* PORTFOLIO (NEW ADDED SECTION) */}
      <h4>📁 Portfolio</h4>

      <p>
        <strong>Portfolio:</strong>{" "}
        {mentorData.portfolio ? (
          <a href={mentorData.portfolio} target="_blank" rel="noreferrer">
            View Link
          </a>
        ) : (
          "-"
        )}
      </p>

      <p>
        <strong>LinkedIn:</strong>{" "}
        {mentorData.linkedin ? (
          <a href={mentorData.linkedin} target="_blank" rel="noreferrer">
            Profile
          </a>
        ) : (
          "-"
        )}
      </p>

      <p>
        <strong>Resume:</strong>{" "}
        {mentorData.resume ? (
          <a href={mentorData.resume} target="_blank" rel="noreferrer">
            Open Resume
          </a>
        ) : (
          "-"
        )}
      </p>

      <p>
        <strong>Bio:</strong>{" "}
        {mentorData.bio || "-"}
      </p>

    </div>
  );
}

export default LivePreview;