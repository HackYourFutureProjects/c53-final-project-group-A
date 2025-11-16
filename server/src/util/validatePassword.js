/**
 * Validates password requirements
 * Password must be at least 8 characters long
 *
 * @param {string} password - The password to validate
 * @returns {string} - Error message if invalid, empty string if valid
 */
const validatePassword = (password) => {
  if (typeof password !== "string") {
    return "Password must be a string";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  return "";
};

export default validatePassword;
