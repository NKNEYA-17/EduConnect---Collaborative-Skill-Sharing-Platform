// ============================================
// Semantic Skill Gap Detection Algorithm
// ============================================

// ============================================
// Skill Knowledge Base
// ============================================

const skillDatabase = {
  "react developer": [
    "React",
    "JavaScript",
    "HTML",
    "CSS",
    "Redux",
    "API Integration",
    "Git",
  ],

  "java developer": [
    "Java",
    "OOP",
    "Spring Boot",
    "Hibernate",
    "MySQL",
    "REST API",
    "Git",
  ],

  "data scientist": [
    "Python",
    "Machine Learning",
    "Statistics",
    "Pandas",
    "NumPy",
    "Data Visualization",
  ],

  "ui/ux designer": [
    "UI Design",
    "UX Research",
    "Wireframing",
    "Figma",
    "Prototyping",
    "Design Thinking",
  ],

  "cyber security specialist": [
    "Networking",
    "Ethical Hacking",
    "Cryptography",
    "Security Tools",
    "Linux",
    "Cyber Security",
  ],

  "data analyst": [
    "Python",
    "SQL",
    "Excel",
    "Data Visualization",
    "Statistics",
    "Power BI",
  ],
};

// ============================================
// Normalize Skill
// ============================================

function normalizeSkill(skill = "") {
  return skill.toLowerCase().replace(/\s+/g, " ").trim();
}

// ============================================
// Semantic Skill Matching
// ============================================

function isSkillMatched(userSkill, requiredSkill) {
  const user = normalizeSkill(userSkill);
  const required = normalizeSkill(requiredSkill);

  if (user === required) return true;

  if (
    required.includes("machine learning") &&
    (user.includes("machine learning") || user.includes("ml"))
  )
    return true;

  if (
    required.includes("cyber security") &&
    (user.includes("cyber") || user.includes("security"))
  )
    return true;

  if (
    required.includes("ui design") &&
    (user.includes("ui") || user.includes("design"))
  )
    return true;

  if (
    required.includes("ux research") &&
    user.includes("ux")
  )
    return true;

  if (
    required.includes("data visualization") &&
    (
      user.includes("data visualization") ||
      user.includes("power bi") ||
      user.includes("tableau")
    )
  )
    return true;

  return false;
}

// ============================================
// Main Skill Gap Detection
// ============================================

export function detectSkillGap(userSkills = [], targetRole = "") {

  const requiredSkills =
    skillDatabase[targetRole.toLowerCase()];

  // Safe fallback
  if (!requiredSkills) {
    return {
      targetRole,
      matchedSkills: [],
      missingSkills: [],
      completionPercentage: 0,
    };
  }

  const matchedSkills = requiredSkills.filter((requiredSkill) =>
    userSkills.some((userSkill) =>
      isSkillMatched(userSkill, requiredSkill)
    )
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  const completionPercentage = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100
  );

  return {
    targetRole,
    matchedSkills,
    missingSkills,
    completionPercentage,
  };
}