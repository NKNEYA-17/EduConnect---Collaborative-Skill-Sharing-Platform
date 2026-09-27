import { useState } from "react";
import PersonalInfo from "./PersonalInfo";
import Education from "./Education";

function MentorForm() {

  const [step, setStep] = useState(1);

  const [mentorData, setMentorData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    education: "",
    institution: "",
    experience: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMentorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => {
    console.log("Next clicked, current step:", step);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    console.log("Back clicked, current step:", step);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    console.log("FINAL DATA:", mentorData);
    alert("Submitted!");
  };

  return (
    <div>

      <h2>Mentor Form (Step {step})</h2>

      {step === 1 && (
        <PersonalInfo
          mentorData={mentorData}
          handleChange={handleChange}
        />
      )}

      {step === 2 && (
        <Education
          mentorData={mentorData}
          handleChange={handleChange}
        />
      )}

      <div style={{ marginTop: "20px" }}>

        {step > 1 && (
          <button onClick={prevStep}>
            Back
          </button>
        )}

        {step < 2 ? (
          <button onClick={nextStep}>
            Next
          </button>
        ) : (
          <button onClick={handleSubmit}>
            Submit
          </button>
        )}

      </div>

    </div>
  );
}

export default MentorForm;