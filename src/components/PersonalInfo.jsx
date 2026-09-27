import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCity,
  FaGlobe,
  FaCamera,
} from "react-icons/fa";

function PersonalInfo({
  mentorData,
  handleChange,
  handlePhotoChange,
  errors, // 👈 IMPORTANT ADDITION
}) {
  return (
    <div className="personal-info">

      <h2>👤 Personal Information</h2>

      <p className="section-text">
        Tell us about yourself to create your mentor profile.
      </p>

      {/* Photo Upload */}
      <div className="photo-upload">
        <label className="field-label">Profile Photo</label>

        <div className="upload-box">
          <FaCamera className="upload-icon" />

          <div className="upload-text">
            <p>Upload Profile Picture</p>
            <span>PNG, JPG or JPEG</span>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
      </div>

      {/* NAME */}
      <div className="input-group">
        <label className="field-label">Full Name</label>

        <div className="input-box">
          <FaUser />
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={mentorData.fullName}
            onChange={handleChange}
          />
        </div>

        {errors?.fullName && (
          <p className="error-text">{errors.fullName}</p>
        )}
      </div>

      {/* EMAIL */}
      <div className="input-group">
        <label className="field-label">Email Address</label>

        <div className="input-box">
          <FaEnvelope />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={mentorData.email}
            onChange={handleChange}
          />
        </div>

        {errors?.email && (
          <p className="error-text">{errors.email}</p>
        )}
      </div>

      {/* PHONE */}
      <div className="input-group">
        <label className="field-label">Phone Number</label>

        <div className="input-box">
          <FaPhone />
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={mentorData.phone}
            onChange={handleChange}
          />
        </div>

        {errors?.phone && (
          <p className="error-text">{errors.phone}</p>
        )}
      </div>

      {/* CITY */}
      <div className="input-group">
        <label className="field-label">City</label>

        <div className="input-box">
          <FaCity />
          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            value={mentorData.city}
            onChange={handleChange}
          />
        </div>

        {errors?.city && (
          <p className="error-text">{errors.city}</p>
        )}
      </div>

      {/* COUNTRY */}
      <div className="input-group">
        <label className="field-label">Country</label>

        <div className="input-box">
          <FaGlobe />
          <input
            type="text"
            name="country"
            placeholder="Enter your country"
            value={mentorData.country}
            onChange={handleChange}
          />
        </div>

        {errors?.country && (
          <p className="error-text">{errors.country}</p>
        )}
      </div>

    </div>
  );
}

export default PersonalInfo;