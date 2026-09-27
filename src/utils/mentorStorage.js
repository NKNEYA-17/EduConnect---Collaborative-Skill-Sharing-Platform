const STORAGE_KEY = "mentorApplicationData";

// Save data
export const saveMentorData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Load data
export const loadMentorData = () => {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (savedData) {
    return JSON.parse(savedData);
  }

  return null;
};

// Clear data
export const clearMentorData = () => {
  localStorage.removeItem(STORAGE_KEY);
};