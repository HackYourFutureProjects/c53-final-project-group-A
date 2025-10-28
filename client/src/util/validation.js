export function validateJobInput({ text, existingTitles = [] }) {
  const trimmedText = text.trim();

  //  Check if the input is empty
  if (trimmedText === "") {
    return {
      type: "error",
      message: "Please add at least one job title before you search.",
    };
  }

  //  Check for special characters
  const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(trimmedText);
  if (hasSpecialChars) {
    return {
      type: "error",
      message: "Special characters are not allowed in job titles.",
    };
  }

  //  Check if the input is only numbers
  const isNumbersOnly = /^\d+$/.test(trimmedText);
  if (isNumbersOnly) {
    return {
      type: "warning",
      message: "Job title cannot consist of numbers only.",
    };
  }

  //  Check for duplicates (case-insensitive)
  const lowerCaseExisting = existingTitles.map((title) => title.toLowerCase());
  if (lowerCaseExisting.includes(trimmedText.toLowerCase())) {
    return {
      type: "warning",
      message: `"${trimmedText}" is already in your list of job titles.`,
    };
  }

  //  If everything is fine, return null
  return null;
}
