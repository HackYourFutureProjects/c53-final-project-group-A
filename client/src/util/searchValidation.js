export function validateJobInput({ text }) {
  //  Check if the input is empty
  if (text === "") {
    return {
      type: "error",
      message: "Please add at least one job title before you search.",
    };
  }

  // Check for invalid special characters
  // Allow: letters, numbers, spaces, and - / , ( ) . '
  const hasInvalidChars = /[^a-zA-Z0-9\s\-,().'/]/;
  if (hasInvalidChars.test(text)) {
    return {
      type: "error",
      message:
        "Invalid characters detected. Allowed characters are letters, numbers, spaces, and these symbols: - / , ( ) . '",
    };
  }

  //  Check if the input is only numbers
  const isNumbersOnly = /^\d+$/.test(text);
  if (isNumbersOnly) {
    return {
      type: "warning",
      message: "Job title cannot consist of numbers only.",
    };
  }

  //  If everything is fine, return null
  return null;
}
