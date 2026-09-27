import React from "react";
// IMPORTANT: if CSS is missing, this line may crash Vite
import "../styles/ReviewSubmit.css";

function ReviewSubmit({ mentorData = {}, handleSubmit }) {
    return (
        <div className="review-page">

            <h2 className="review-title">Review & Submit</h2>
            <p className="review-subtitle">
                Please check your details before submitting
            </p>

            <div className="review-card">
                <h3>Personal Information</h3>
                <p><b>Name:</b> {mentorData.fullName || "Not provided"}</p>
                <p><b>Email:</b> {mentorData.email || "Not provided"}</p>
                <p><b>Phone:</b> {mentorData.phone || "Not provided"}</p>
            </div>

            <div className="review-card">
                <h3>Skills</h3>
                <div className="tag-container">
                    {mentorData.skills?.length > 0 ? (
                        mentorData.skills.map((skill, i) => (
                            <span key={i} className="tag">{skill}</span>
                        ))
                    ) : (
                        <p>Not selected</p>
                    )}
                </div>
            </div>

            <div className="review-card">
                <h3>Education</h3>
                <p><b>Degree:</b> {mentorData.degree || "Not provided"}</p>
                <p><b>University:</b> {mentorData.university || "Not provided"}</p>
                <p><b>Year:</b> {mentorData.graduationYear || "Not provided"}</p>
            </div>

            <div className="review-card">
                <h3>Portfolio</h3>
                <p>{mentorData.portfolio || "Not provided"}</p>
            </div>

            <button
  className="submit-btn"
  onClick={() => {
    console.log("GREEN BUTTON CLICKED");
    console.log("handleSubmit =", handleSubmit);

    if (handleSubmit) {
      handleSubmit();
    } else {
      alert("handleSubmit was NOT passed!");
    }
  }}
>
  Submit Application
</button>

        </div>
    );
}

export default ReviewSubmit;