import validatePassword from "../validatePassword.js";

describe("validatePassword", () => {
  test("Valid passwords should return empty string", () => {
    expect(validatePassword("password123")).toBe("");
    expect(validatePassword("12345678")).toBe("");
    expect(validatePassword("longpasswordwithlotofcharacters")).toBe("");
    expect(validatePassword("P@ssw0rd!")).toBe("");
  });

  test("Short passwords should return error message", () => {
    expect(validatePassword("short")).toBe(
      "Password must be at least 8 characters long",
    );
    expect(validatePassword("1234567")).toBe(
      "Password must be at least 8 characters long",
    );
    expect(validatePassword("")).toBe(
      "Password must be at least 8 characters long",
    );
  });

  test("Non-string passwords should return error message", () => {
    expect(validatePassword(null)).toBe("Password must be a string");
    expect(validatePassword(undefined)).toBe("Password must be a string");
    expect(validatePassword(123)).toBe("Password must be a string");
    expect(validatePassword({})).toBe("Password must be a string");
  });
});
