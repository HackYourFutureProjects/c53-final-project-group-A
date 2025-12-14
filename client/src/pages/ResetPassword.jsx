import {
  useState,
  // , useEffect
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { UseUser } from "../context/UserContext";
import {
  validatePassword,
  validatePasswordMatch,
} from "../util/AuthValidation";
import { Eye, EyeOff } from "lucide-react";
// assuming your helper functions are in helpers/validation.js

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // Retrieves the reset token from the URL query parameters

  const navigate = useNavigate();

  const {
    resetPassword,
    loading,
    error,
    // , clearError
  } = UseUser();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  // NEW: visibility toggles
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // useEffect(() => {
  //   clearError();
  //   // Clear any previous error messages when component mounts
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent form submission from refreshing the page

    // clearError();
    // Clear previous errors before validation

    if (!token) {
      alert("Invalid or missing token.");
      // Token must exist to proceed with password reset
      return;
    }

    // Validate password rules
    if (!validatePassword(newPassword)) {
      alert(
        "Password must be at least 8 characters and meet at least two of the following: uppercase, lowercase, number, symbol.",
      );
      return;
    }

    // Validate passwords match
    const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchValidation.valid) {
      alert(matchValidation.message);
      return;
    }

    const result = await resetPassword(token, newPassword);
    // Calls the backend to update the password with the token

    if (result) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="form-card">
        <h2>Password Reset Successful!</h2>
        <p>Your password has been updated.</p>
        <button onClick={() => navigate("/login")}>Back to Login</button>
        {/* Navigate user back to login after success */}
      </div>
    );
  }

  return (
    <div className="form-card">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type={showNewPass ? "text" : "password"}
            placeholder="New Password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ paddingRight: "35px" }}
            // Update newPassword state when user types
          />
          {showNewPass ? (
            <EyeOff
              size={18}
              className="input-icon-right"
              onClick={() => setShowNewPass(false)}
            />
          ) : (
            <Eye
              size={18}
              className="input-icon-right"
              onClick={() => setShowNewPass(true)}
            />
          )}
        </div>
        <div className="input-wrapper">
          <input
            type={showConfirmPass ? "text" : "password"}
            placeholder="Confirm New Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ paddingRight: "35px" }}
            // Update confirmPassword state when user types
          />
          {showConfirmPass ? (
            <EyeOff
              size={18}
              className="input-icon-right"
              onClick={() => setShowConfirmPass(false)}
            />
          ) : (
            <Eye
              size={18}
              className="input-icon-right"
              onClick={() => setShowConfirmPass(true)}
            />
          )}
        </div>
        {error && <p className="error-text">{error}</p>}
        {/* Display any error returned from backend */}
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save New Password"}
          {/* Show loading text while waiting for backend */}
        </button>
      </form>
      <p className="switch-text">
        <span className="switch-link" onClick={() => navigate("/login")}>
          Back to Login
        </span>
      </p>
    </div>
  );
};

export default ResetPasswordForm;
