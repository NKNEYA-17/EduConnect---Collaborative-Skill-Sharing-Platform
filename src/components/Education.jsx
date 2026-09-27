import {
  FaGraduationCap,
  FaUniversity,
  FaCalendarAlt,
  FaBriefcase,
  FaUserTie,
} from "react-icons/fa";

function Education({ mentorData, handleChange }) {
  return (
    <div className="education">

      <h2>🎓 Education & Experience</h2>

      <p className="section-text">
        Tell learners about your education and professional experience.
      </p>

      <div className="education-grid">

        {/* Degree */}

        <div className="input-group">

          <label>Degree</label>

          <div className="input-icon">

            <FaGraduationCap />

            <input
              type="text"
              name="degree"
              placeholder="Enter your degree"
              value={mentorData.degree || ""}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={mentorData.department}
            onChange={handleChange}
            placeholder="Enter your department"
            />
            </div>

        </div>

        {/* University */}

        <div className="input-group">

          <label>University / College</label>

          <div className="input-icon">

            <FaUniversity />

            <input
              type="text"
              name="university"
              placeholder="Enter your university / college"
              value={mentorData.university}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Graduation Year */}

        <div className="input-group">

          <label>Graduation Year</label>

          <div className="input-icon">

            <FaCalendarAlt />

            <input
              type="number"
              name="graduationYear"
              placeholder="Enter graduation year"
              value={mentorData.graduationYear}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Experience */}

        <div className="input-group">

          <label>Years of Experience</label>

          <div className="input-icon">

            <FaBriefcase />

            <input
              type="number"
              name="experience"
              placeholder="Enter years of experience"
              value={mentorData.experience}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Profession */}

        <div className="input-group full-width">

          <label>Current Profession</label>

          <div className="input-icon">

            <FaUserTie />

            <input
              type="text"
              name="profession"
              placeholder="Enter your current profession"
              value={mentorData.profession}
              onChange={handleChange}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default Education;