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
