export function validateJobInput({ text }) {
  if (text === "") {
    return {
      type: "error",
      message: "Please add at least one job title before you search.",
    };
  }

  const hasInvalidChars = /[^a-zA-Z0-9\s\-.'/]/;
  if (hasInvalidChars.test(text)) {
    return {
      type: "error",
      message:
        "Invalid characters detected. Allowed characters are letters, numbers, spaces, and these symbols: -.'/",
    };
  }

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
