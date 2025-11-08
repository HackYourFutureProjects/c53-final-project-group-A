export function validateAddressTextInputs({ text }) {
  //  Check if the input is empty
  if (text === "") {
    return {
      type: "error",
      message: "Please add at least one address line before you save.",
    };
  }

  // Check for invalid special characters
  const hasInvalidChars = /[^a-zA-Z0-9\s\-/.']/;
  if (hasInvalidChars.test(text)) {
    return {
      type: "error",
      message:
        "Invalid characters detected. Allowed characters are letters, numbers, spaces, and these symbols: -/.'",
    };
  }

  // Everything is fine
  return null;
}
