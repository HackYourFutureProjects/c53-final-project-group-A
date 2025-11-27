import validateAllowedFields from "./validateAllowedFields.js";
import { validatePassword } from "./validatePassword.js";

// Basic email format check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function validateCreactUser(user) {
  const errors = [];

  if (!user || typeof user !== "object") {
    return { valid: false, errors: ["Invalid user payload"] };
  }

  // Check allowed fields only
  const disallowed = validateAllowedFields(user, [
    "firstname",
    "lastname",
    "email",
    "password",
    "avatar",
    "street",
    "housenumber",
    "city",
    "country",
    "skills",
    "favorites",
  ]);

  if (disallowed) errors.push(disallowed);

  // Required fields
  if (!user.firstname || String(user.firstname).trim() === "") {
    errors.push("First name is required");
  }
  if (!user.lastname || String(user.lastname).trim() === "") {
    errors.push("Last name is required");
  }
  if (!user.email || String(user.email).trim() === "") {
    errors.push("Email is required");
  }
  if (!user.password) {
    errors.push("Password is required");
  }

  // Email format
  if (user.email && !emailRegex.test(String(user.email).trim())) {
    errors.push("Invalid email format");
  }

  // Strict password validation
  if (user.password && !validatePassword(user.password)) {
    errors.push(
      "Password must be at least 8 chars and include uppercase, lowercase, number, and symbol",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
