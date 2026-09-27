// ============================================
// LLM Career Analysis (Mock AI)
// ============================================

export function generateLLMAnalysis(skillGapResult = {}) {

  const {
    targetRole = "Software Developer",
    matchedSkills = [],
    missingSkills = [],
    completionPercentage = 0,
  } = skillGapResult;

  let analysis = "";

  // ============================================
  // Beginner
  // ============================================

  if (completionPercentage < 30) {

    analysis = `
You are at the beginning of your journey toward becoming a ${targetRole}.

You already have a good foundation with:
${matchedSkills.length > 0 ? matchedSkills.join(", ") : "No matching skills yet"}.

To become job-ready, focus on learning:
${missingSkills.length > 0 ? missingSkills.join(", ") : "Continue improving your skills"}.

Start with beginner tutorials, build small projects, and practice consistently.
`;

  }

  // ============================================
  // Intermediate
  // ============================================

  else if (completionPercentage < 70) {

    analysis = `
You have already learned several important skills for becoming a ${targetRole}.

Your strengths include:
${matchedSkills.length > 0 ? matchedSkills.join(", ") : "No matching skills yet"}.

To become industry-ready, focus on:
${missingSkills.length > 0 ? missingSkills.join(", ") : "No major skill gaps"}.

Begin building portfolio projects and solving real-world problems.
`;

  }

  // ============================================
  // Advanced
  // ============================================

  else {

    analysis = `
Excellent work!

You already possess most of the required skills for a ${targetRole}.

Strengths:
${matchedSkills.length > 0 ? matchedSkills.join(", ") : "Excellent skill set"}.

To become highly competitive, improve:
${missingSkills.length > 0 ? missingSkills.join(", ") : "No major skill gaps"}.

Start contributing to open-source projects and prepare for technical interviews.
`;

  }

  // ============================================
  // Recommended Project
  // ============================================

  let project = "";

  switch (targetRole.toLowerCase()) {

    case "java developer":
      project =
        "Build a Student Management System using Spring Boot and MySQL.";
      break;

    case "react developer":
      project =
        "Build a Full Stack Skill Sharing Platform using React, Spring Boot and MongoDB.";
      break;

    case "data scientist":
      project =
        "Build a House Price Prediction Model using Machine Learning.";
      break;

    case "ui/ux designer":
      project =
        "Design a Mobile Banking Application using Figma.";
      break;

    case "cyber security specialist":
      project =
        "Perform Vulnerability Assessment on a Sample Web Application.";
      break;

    case "data analyst":
      project =
        "Create a Sales Dashboard using Power BI.";
      break;

    default:
      project =
        "Build a portfolio project related to your selected career path.";
  }

  return {
    analysis,
    recommendedProject: project,
  };
}