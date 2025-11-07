export function validateSkillInput({ text }) {
  const trimmedText = text.trim();

  if (trimmedText === "") {
    return {
      type: "error",
      message: "You entered an empty string. Please enter the a skill name",
    };
  }

  const hasInvalidChars = /[^a-zA-Z0-9 \-/#+]/;
  if (hasInvalidChars.test(trimmedText)) {
    return {
      type: "error",
      message:
        "Invalid characters detected. Allowed characters are letters, numbers, spaces, and these symbols: -/+#",
    };
  }

  const isNumbersOnly = /^\d+$/.test(trimmedText);
  if (isNumbersOnly) {
    return {
      type: "warning",
      message: "The skill cannot consist of numbers only.",
    };
  }

  return null;
}
