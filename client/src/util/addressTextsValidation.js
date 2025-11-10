export function validateAddressTextInputs({ text, type = "general" }) {
  if (type === "country" && text !== "Netherlands") {
    return {
      type: "error",
      message:
        "Sorry, at the moment our app only supports addresses in the Netherlands.",
    };
  }

  if (text === "" && type === "city") {
    return {
      type: "error",
      message: "Before saving, add at least one line with the city.",
    };
  }

  const isNumbersOnly = /^\d+$/.test(text);
  if (isNumbersOnly) {
    return {
      type: "error",
      message: "The name of a city or street cannot consist only of numbers.",
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
