import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AlertMessage from "../components/AlertMessage/AlertMessage";

import useFetch from "../hooks/useFetch";
import {
  validatePassword,
  validatePasswordMatch,
} from "../util/AuthValidation";
import { gif } from "../assets";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // NEW: visibility toggles
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { isLoading, error, performFetch } = useFetch(
    "/users/reset-password",
    () => setResetSuccess(true),
  );

  useEffect(() => {
    if (error) {
      // setAlert({ type: "error", message: String(error) });
      const timer = setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid or missing token.");
      return;
    }
    if (!validatePassword(newPassword)) {
      alert(
        "Password must be at least 8 characters and meet at least two of the following: uppercase, lowercase, number, symbol.",
      );
      return;
    }
    const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchValidation.valid) {
      alert(matchValidation.message);
      return;
    }

    performFetch({
      method: "POST",
      body: JSON.stringify({
        token,
        newPassword,
      }),
    });
  };

  return (
    <>
      {resetSuccess ? (
        <div className="form-card">
          <h2>Password Reset Successful!</h2>
          <p>Your password has been updated.</p>
          <button onClick={() => navigate("/login")}>Back to Login</button>
        </div>
      ) : (
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

            {alert.message && (
              <AlertMessage type={alert.type} message={alert.message} />
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span>Saving...</span>
                  <img src={gif.spinner} className="spinner" />
                </>
              ) : (
                "Save New Password"
              )}
            </button>
          </form>
          <p className="switch-text">
            <span className="switch-link" onClick={() => navigate("/login")}>
              Back to Login
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default ResetPasswordForm;
