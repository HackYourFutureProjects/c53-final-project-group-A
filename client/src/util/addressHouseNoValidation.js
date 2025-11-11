export function validateHouseNoInput({ text }) {
  const isNumbersOnly = /^\d+$/.test(text);
  if (text !== "" && !isNumbersOnly) {
    return {
      type: "error",
      message:
        "House number must contain only numbers, no letters or special characters.",
    };
  }
  // Everything is fine
  return null;
}
