/**
 * Validates email format using a standard regex pattern
 * Returns true if email is valid, false otherwise
 *
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateEmail = (email) => {
  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default validateEmail;
