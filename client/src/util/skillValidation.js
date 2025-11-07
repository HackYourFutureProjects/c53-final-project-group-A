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
        "Invalid characters detected. Allowed characters are letters, numbers, spaces, and these symbols: -/+#",
    };
  }

  const isNumbersOnly = /^\d+$/.test(text);
  if (isNumbersOnly) {
    return {
      type: "warning",
      message: "The skill cannot consist of numbers only.",
    };
  }

  const normalizedText = text.trim().toLowerCase();
  const normalizedSkills = skills.map((s) =>
    String(s.skill).trim().toLowerCase(),
  );
  if (normalizedSkills.includes(normalizedText)) {
    return {
      type: "error",
      message: "This skill is already added.",
    };
  }

  return null;
}
