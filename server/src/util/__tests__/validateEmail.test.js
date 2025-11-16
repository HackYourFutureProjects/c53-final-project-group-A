import validateEmail from "../validateEmail.js";

describe("validateEmail", () => {
  test("Valid email addresses should return true", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("user.name@example.com")).toBe(true);
    expect(validateEmail("user+tag@example.co.uk")).toBe(true);
    expect(validateEmail("user_name@example-domain.com")).toBe(true);
  });

  test("Invalid email addresses should return false", () => {
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("notanemail")).toBe(false);
    expect(validateEmail("@example.com")).toBe(false);
    expect(validateEmail("user@")).toBe(false);
    expect(validateEmail("user@domain")).toBe(false);
    expect(validateEmail("user name@example.com")).toBe(false);
    expect(validateEmail("user@domain .com")).toBe(false);
  });
});
