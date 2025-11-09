import { useState } from "react";
import { Loader, X, UserPlus, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
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
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { loading, error } = useAuth();

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
      signupData.firstName,
      signupData.lastName,
      signupData.email,
      signupData.password,
    );

    if (!error) {
      const fullName = `${signupData.firstName} ${signupData.lastName}`;
      setSignedUpUser(fullName);
      setSuccessPopup(true);
      setSignupData({
        firstName: "",
        lastName: "",
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
            <label>First Name</label>
            <input
              type="text"
              value={signupData.firstName}
              onChange={(e) =>
                setSignupData({ ...signupData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Last Name</label>
            <input
              type="text"
              value={signupData.lastName}
              onChange={(e) =>
                setSignupData({ ...signupData, lastName: e.target.value })
              }
              required
            />
          </div>
        </div>

        <label>Email</label>
        <input
          type="email"
          value={signupData.email}
          onChange={(e) =>
            setSignupData({ ...signupData, email: e.target.value })
          }
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={signupData.password}
          onChange={(e) =>
            setSignupData({ ...signupData, password: e.target.value })
          }
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={signupData.confirmPassword}
          onChange={(e) =>
            setSignupData({ ...signupData, confirmPassword: e.target.value })
          }
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
            "Contains uppercase letter",
          )}
          {renderRuleItem(
            passwordRules.lowercase(pw),
            "Contains lowercase letter",
          )}
          {renderRuleItem(passwordRules.number(pw), "Contains number")}
          {renderRuleItem(passwordRules.symbol(pw), "Contains symbol")}
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
        <span className="switch-link" onClick={switchToLogin}>
          Login
        </span>
      </p>
    </div>
  );
};

export default SignupForm;
