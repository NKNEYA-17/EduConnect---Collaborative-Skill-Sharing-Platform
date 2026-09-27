export const validateStep = (step, mentorData) => {
  const errors = {};

  switch (step) {
    case 1:
      if (!mentorData.fullName.trim())
        errors.fullName = "Full Name is required";

      if (!mentorData.email.trim())
        errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(mentorData.email))
        errors.email = "Enter a valid email address";

      if (!mentorData.phone.trim())
        errors.phone = "Phone Number is required";

      break;

    case 2:
      if (!mentorData.degree.trim())
        errors.degree = "Degree is required";

      if (!mentorData.university.trim())
        errors.university = "University is required";

      break;

    case 3:
      if (mentorData.skills.length === 0)
        errors.skills = "Please select at least one skill";

      break;

    case 4:
      if (!mentorData.bio.trim())
        errors.bio = "Bio is required";

      break;
  }

  return errors;
};