export function validateSkillInput({ text, skills = [] }) {
  if (text === "") {
    return {
      type: "error",
      message: "You entered an empty string. Please enter a skill name",
    };
  }

  const hasInvalidChars = /[^a-zA-Z0-9 \-/#+]/;
  if (hasInvalidChars.test(text)) {
    return {
      type: "error",
      message:
        "Invalid characters detected. Allowed characters are letters, numbers, spaces, and these symbols: -/#+",
    };
  }

  const isNumbersOnly = /^\d+$/.test(text);
  if (isNumbersOnly) {
    return {
      type: "warning",
      message: "The skill cannot consist of numbers only.",
    };
  }

  const normalizedText = text.toLowerCase();
  const normalizedSkills = skills.map((s) => s.normalizedSkill);
  if (normalizedSkills.includes(normalizedText)) {
    return {
      type: "error",
      message: "This skill is already added.",
    };
  }

  return null;
}

// Password validation rules
export const passwordRules = {
  length: (pw) => pw.length >= 8,
  uppercase: (pw) => /[A-Z]/.test(pw),
  lowercase: (pw) => /[a-z]/.test(pw),
  number: (pw) => /\d/.test(pw),
  symbol: (pw) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw),
};

// Validate password against rules
export function validatePassword(pw) {
  const count = Object.values(passwordRules).filter((rule) => rule(pw)).length;
  return pw.length >= 8 && count >= 2;
}

// Check if passwords match
export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { valid: false, message: "Passwords do not match!" };
  }
  return { valid: true };
}

// Email validation
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email address." };
  }
  return { valid: true };
}
