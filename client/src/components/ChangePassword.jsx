import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Eye, EyeOff } from "lucide-react";
import useFetch from "../hooks/useFetch";
import {
  validatePassword,
  validatePasswordMatch,
} from "../util/AuthValidation";

const ChangePassword = forwardRef(function ChangePassword(
  { onKeyDown, onInputChange, setAlert, onPasswordChangeSuccess },
  ref,
) {
  const currentPasswordInputRef = useRef(null);
  const newPasswordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);

  const { performFetch } = useFetch("/users/change-password", (data) => {
    setAlert({ type: "success", message: data.msg });
  });

  async function handlePasswordChange() {
    const currentPasswordEl = currentPasswordInputRef.current;
    const newPasswordEl = newPasswordInputRef.current;
    const confirmPasswordEl = confirmPasswordInputRef.current;

    if (!currentPasswordEl || !newPasswordEl || !confirmPasswordEl) {
      return { success: false, hasChanges: false };
    }

    const newPassword = newPasswordEl.value || "";
    const confirmPassword = confirmPasswordEl.value || "";
    const currentPassword = currentPasswordEl.value || "";

    // If no password fields are filled, return no changes
    if (!newPassword && !confirmPassword && !currentPassword) {
      return { success: true, hasChanges: false };
    }

    // Validate that current password is provided
    if (!currentPassword) {
      setAlert({
        type: "error",
        message: "Current password is required to change password.",
      });
      return { success: false, hasChanges: true };
    }

    // Validate new password format
    if (!validatePassword(newPassword)) {
      setAlert({
        type: "error",
        message:
          "Password must be at least 8 characters and meet at least 2 complexity rules.",
      });
      return { success: false, hasChanges: true };
    }

    // Validate password match
    const matchCheck = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchCheck.valid) {
      setAlert({ type: "error", message: matchCheck.message });
      return { success: false, hasChanges: true };
    }

    // Attempt to change password
    try {
      await performFetch({
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      setAlert({
        type: "success",
        message: "Password updated successfully!",
      });

      // Clear password fields
      currentPasswordEl.value = "";
      newPasswordEl.value = "";
      confirmPasswordEl.value = "";

      if (onPasswordChangeSuccess) {
        onPasswordChangeSuccess();
      }

      return { success: true, hasChanges: true };
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to change password.",
      });
      return { success: false, hasChanges: true };
    }
  }

  // Expose the handlePasswordChange function to parent via ref
  useImperativeHandle(ref, () => ({
    handlePasswordChange,
  }));

  return (
    <div className="profile-section">
      <h3 className="profile-section-title">Change password</h3>
      <div className="profile-password-single">
        <label className="profile-field-label">
          Type your current password
        </label>
        <div className="profile-input-wrapper">
          <input
            id="currentPasswordInput"
            ref={currentPasswordInputRef}
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Type 8 characters or more"
            className="profile-input profile-input-with-icon"
            onKeyDown={onKeyDown}
            onChange={onInputChange}
          />
          {showCurrentPassword ? (
            <EyeOff
              size={18}
              className="profile-input-icon"
              onClick={() => setShowCurrentPassword(false)}
            />
          ) : (
            <Eye
              size={18}
              className="profile-input-icon"
              onClick={() => setShowCurrentPassword(true)}
            />
          )}
        </div>
      </div>
      <div className="profile-fields-grid">
        <div>
          <label className="profile-field-label">Set new password</label>
          <div className="profile-input-wrapper">
            <input
              id="newPasswordInput"
              ref={newPasswordInputRef}
              type={showNewPassword ? "text" : "password"}
              placeholder="Type 8 characters or more"
              className="profile-input profile-input-with-icon"
              onKeyDown={onKeyDown}
              onChange={onInputChange}
            />
            {showNewPassword ? (
              <EyeOff
                size={18}
                className="profile-input-icon"
                onClick={() => setShowNewPassword(false)}
              />
            ) : (
              <Eye
                size={18}
                className="profile-input-icon"
                onClick={() => setShowNewPassword(true)}
              />
            )}
          </div>
        </div>

        <div>
          <label className="profile-field-label">Confirm password</label>
          <div className="profile-input-wrapper">
            <input
              id="confirmPasswordInput"
              ref={confirmPasswordInputRef}
              type={showConfirmationPassword ? "text" : "password"}
              placeholder="Write the same password again"
              className="profile-input profile-input-with-icon"
              onKeyDown={onKeyDown}
              onChange={onInputChange}
            />
            {showConfirmationPassword ? (
              <EyeOff
                size={18}
                className="profile-input-icon"
                onClick={() => setShowConfirmationPassword(false)}
              />
            ) : (
              <Eye
                size={18}
                className="profile-input-icon"
                onClick={() => setShowConfirmationPassword(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChangePassword;
