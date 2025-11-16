import { useState } from "react";
import { Loader, X, UserPlus, CheckCircle, XCircle } from "lucide-react";
import { UseUser } from "../../context/UserContext";
import {
  passwordRules,
  validatePassword,
  validatePasswordMatch,
  validateEmail,
} from "../../util/AuthValidation";

const SignupForm = ({
  signup,
  setSuccessPopup,
  setSignedUpUser,
  switchToLogin,
}) => {
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { loading, error, clearError } = UseUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
    clearError(); // clear context error while typing
    setErrorMessage(""); //clear local error while typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const emailCheck = validateEmail(signupData.email);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.message);
      return;
    }

    // Validate password match
    const matchCheck = validatePasswordMatch(
      signupData.password,
      signupData.confirmPassword,
    );
    if (!matchCheck.valid) {
      setErrorMessage(matchCheck.message);
      return;
    }

    // Validate password strength
    if (!validatePassword(signupData.password)) {
      setErrorMessage("Password does not meet requirements.");
      return;
    }

    setErrorMessage("");
    await signup(
      signupData.firstname,
      signupData.lastname,
      signupData.email,
      signupData.password,
    );

    if (!error) {
      const fullName = `${signupData.firstname} ${signupData.lastname}`;
      setSignedUpUser(fullName);
      setSuccessPopup(true);
      setSignupData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const pw = signupData.password;

  const renderRuleItem = (condition, text) => {
    const isValid = condition;
    return (
      <li
        key={text}
        className={`password-rule-item ${isValid ? "valid" : "invalid"}`}
      >
        {isValid ? <CheckCircle size={16} /> : <XCircle size={16} />}
        {text}
      </li>
    );
  };

  return (
    <div className="form-card" id="signup-form">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "16px" }}>
          <div style={{ flex: 1 }}>
            <label>
              First Name{" "}
              <span style={{ color: "red", marginLeft: "2px" }}>*</span>
            </label>
            <input
              type="text"
              name="firstname" // added name for handleChange
              placeholder="First name"
              value={signupData.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>
              Last Name{" "}
              <span style={{ color: "red", marginLeft: "2px" }}>*</span>
            </label>
            <input
              type="text"
              name="lastname" //added name
              placeholder="Last name"
              value={signupData.lastname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label>
          Email <span style={{ color: "red", marginLeft: "2px" }}>*</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={signupData.email}
          onChange={handleChange}
          required
        />

        <label>
          Password <span style={{ color: "red", marginLeft: "2px" }}>*</span>
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={signupData.password}
          onChange={handleChange}
          required
        />

        <label>
          Confirm Password{" "}
          <span style={{ color: "red", marginLeft: "2px" }}>*</span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={signupData.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* Password Requirements - Now using the helper function and new class */}
        <p
          style={{ marginTop: "10px", marginBottom: "8px", fontWeight: "bold" }}
        >
          Password requirements
        </p>
        <ul className="password-rule-list">
          {renderRuleItem(passwordRules.length(pw), "At least 8 characters")}
          {renderRuleItem(
            passwordRules.uppercase(pw),
            "Contains uppercase letters",
          )}
          {renderRuleItem(
            passwordRules.lowercase(pw),
            "Contains lowercase letters",
          )}
          {renderRuleItem(passwordRules.number(pw), "Contains numbers")}
          {renderRuleItem(passwordRules.symbol(pw), "Contains symbols")}
        </ul>

        {errorMessage && (
          <p className="error-text">
            <X size={14} style={{ marginRight: "5px" }} />
            {errorMessage}
          </p>
        )}

        {error && (
          <p className="error-text">
            <X size={14} style={{ marginRight: "5px" }} />
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader
                className="spin"
                size={18}
                style={{ marginRight: "5px" }}
              />
              Signing up...
            </>
          ) : (
            <>
              <UserPlus size={16} style={{ marginRight: "5px" }} />
              Sign Up
            </>
          )}
        </button>
      </form>

      <p className="switch-text">
        Already have a profile?{" "}
        <span
          className="switch-link"
          onClick={() => {
            switchToLogin();
            clearError(); // clear error when switching to login
            setErrorMessage(""); //clear local error when switching
          }}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default SignupForm;
