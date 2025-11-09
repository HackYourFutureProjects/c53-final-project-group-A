export function validateAddressTextInputs({ text, type = "general" }) {
  if (type === "country" && text !== "Netherlands") {
    return {
      type: "error",
      message:
        "Sorry, at the moment our app only supports addresses in the Netherlands.",
    };
  }

  if (text === "") {
    return {
      type: "error",
      message: "Please add at least one address line before you save.",
    };
  }

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
