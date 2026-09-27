function Stepper({ currentStep }) {
  const steps = [
    "Personal",
    "Education",
    "Skills",
    "Portfolio",
    "Submit",
  ];

  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${currentStep >= index + 1 ? "active" : ""}`}
        >
          <div className="circle">{index + 1}</div>

          {index < steps.length - 1 && (
            <div
              className={`line ${
                currentStep > index + 1 ? "active-line" : ""
              }`}
            ></div>
          )}

          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}

export default Stepper;