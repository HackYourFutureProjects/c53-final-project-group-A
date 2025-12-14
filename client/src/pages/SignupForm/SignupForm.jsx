import { useState, useEffect } from "react";
import {
  UserPlus,
  CheckCircle,
  XCircle,
  Mail,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import { UseUser } from "../../context/UserContext";
import {
  passwordRules,
  validatePassword,
  validatePasswordMatch,
  validateEmail,
} from "../../util/AuthValidation";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import { gif } from "../../assets";
import useFetch from "../../hooks/useFetch";
import { fixUserSkills } from "../../util/fixUserSkills";
import { defaultUser } from "../../data/defaultUser";

const SignupForm = ({ setSignupSuccessPopup, switchToLogin }) => {
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);
  const { dispatch } = UseUser();

  function handleClearAlert() {
    setAlert({ type: "", message: "" });
  }

  function handleSignupResults(data) {
    const normalizedSkills = fixUserSkills(data.user.skills);
    dispatch({
      type: "REGISTER",
      payload: {
        ...data.user,
        skills: normalizedSkills,
        favorites: [],
      },
    });
    setSignupSuccessPopup(true);
  }

  const { isLoading, error, performFetch } = useFetch(
    "/users",
    handleSignupResults,
  );

  useEffect(() => {
    if (error) {
      setAlert({ type: "error", message: String(error) });
      setSignupSuccessPopup(false);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
    handleClearAlert();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const emailCheck = validateEmail(signupData.email);
    if (!emailCheck.valid) {
      setAlert({ type: "error", message: emailCheck.message });
      return;
    }

    // Validate password match
    const matchCheck = validatePasswordMatch(
      signupData.password,
      signupData.confirmPassword,
    );
    if (!matchCheck.valid) {
      setAlert({ type: "error", message: matchCheck.message });
      return;
    }

    // Validate password strength
    if (!validatePassword(signupData.password)) {
      setAlert({
        type: "error",
        message: "Password does not meet requirements.",
      });
      return;
    }

    performFetch({
      method: "POST",
      body: JSON.stringify({
        user: {
          ...defaultUser,
          skills: defaultUser.skills.map((s) => s.skill),
          firstname: signupData.firstname,
          lastname: signupData.lastname,
          email: signupData.email,
          password: signupData.password,
        },
      }),
      credentials: "include",
    });
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
            <div className="input-wrapper">
              <input
                type="text"
                name="firstname" // added name for handleChange
                placeholder="First name"
                value={signupData.firstname}
                onChange={handleChange}
                required
                style={{ paddingRight: "35px" }}
              />
              <User size={18} className="input-icon-right" />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label>
              Last Name{" "}
              <span style={{ color: "red", marginLeft: "2px" }}>*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                name="lastname" //added name
                placeholder="Last name"
                value={signupData.lastname}
                onChange={handleChange}
                required
                style={{ paddingRight: "35px" }}
              />
              <User size={18} className="input-icon-right" />
            </div>
          </div>
        </div>

        <label>
          Email <span style={{ color: "red", marginLeft: "2px" }}>*</span>
        </label>
        <div className="input-wrapper">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={signupData.email}
            onChange={handleChange}
            required
            style={{ paddingRight: "35px" }}
          />
          <Mail size={18} className="input-icon-right" />
        </div>

        <label>
          Password <span style={{ color: "red", marginLeft: "2px" }}>*</span>
        </label>
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={signupData.password}
            onChange={handleChange}
            required
            style={{ paddingRight: "35px" }}
          />
          {showPassword ? (
            <EyeOff
              size={18}
              className="input-icon-right"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Eye
              size={18}
              className="input-icon-right"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        <label>
          Confirm Password{" "}
          <span style={{ color: "red", marginLeft: "2px" }}>*</span>
        </label>
        <div className="input-wrapper">
          <input
            type={showConfirmationPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={signupData.confirmPassword}
            onChange={handleChange}
            required
            style={{ paddingRight: "35px" }}
          />
          {showConfirmationPassword ? (
            <EyeOff
              size={18}
              className="input-icon-right"
              onClick={() => setShowConfirmationPassword(false)}
            />
          ) : (
            <Eye
              size={18}
              className="input-icon-right"
              onClick={() => setShowConfirmationPassword(true)}
            />
          )}
        </div>

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

        {alert.message && (
          <AlertMessage type={alert.type} message={alert.message} />
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span>Signing up...</span>
              <img src={gif.spinner} className="spinner" />
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
            handleClearAlert();
          }}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default SignupForm;
