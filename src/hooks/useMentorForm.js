import { useState, useEffect } from "react";
import {
  saveToStorage,
  loadFromStorage,
  clearStorage,
} from "../utils/mentorStorage";

import { validateStep } from "../utils/mentorValidation";

const initialState = {
  profilePhoto: null,
  fullName: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  degree: "",
  university: "",
  graduationYear: "",
  experience: "",
  profession: "",
  skills: [],
  primarySkill: "",
  languages: "",
  bio: "",
  linkedin: "",
  portfolio: "",
  resume: null,
};

export const useMentorForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [mentorData, setMentorData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // LOAD
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) setMentorData(saved);
  }, []);

  // AUTO SAVE
  useEffect(() => {
    saveToStorage(mentorData);
  }, [mentorData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMentorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    const validationErrors = validateStep(currentStep, mentorData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSkillChange = (skills) => {
    setMentorData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleSubmit = (navigate) => {
    const validationErrors = validateStep(currentStep, mentorData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    clearStorage();

    alert("Application Submitted Successfully!");
    navigate("/");
  };

  const saveLater = () => {
    saveToStorage(mentorData);
    alert("Progress saved!");
  };

  const reset = () => {
    setMentorData(initialState);
    setCurrentStep(1);
    clearStorage();
  };

  return {
    currentStep,
    mentorData,
    errors,
    setCurrentStep,
    handleChange,
    handleNext,
    handleBack,
    handleSkillChange,
    handleSubmit,
    saveLater,
    reset,
  };
};