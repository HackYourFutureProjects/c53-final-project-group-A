// Password validation rules
export const passwordRules = {
  length: (pw) => pw.length >= 8,
  uppercase: (pw) => /[A-Z]/.test(pw),
  lowercase: (pw) => /[a-z]/.test(pw),
  number: (pw) => /\d/.test(pw),
  symbol: (pw) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw),
};

// Validate password using strict rules: all conditions must pass
export function validatePassword(pw) {
  return (
    passwordRules.length(pw) &&
    passwordRules.uppercase(pw) &&
    passwordRules.lowercase(pw) &&
    passwordRules.number(pw) &&
    passwordRules.symbol(pw)
  );
}
