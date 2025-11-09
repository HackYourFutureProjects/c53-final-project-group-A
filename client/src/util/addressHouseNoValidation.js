export function validateHouseNoInput({ text }) {
  if (text === "") {
    return {
      type: "error",
      message: "Please add a house number before you save.",
    };
  }

  const isNumbersOnly = /^\d+$/.test(text);
  if (!isNumbersOnly) {
    return {
      type: "warning",
      message:
        "House number must contain only numbers, no letters or special characters.",
    };
  }
  // Everything is fine
  return null;
}
