import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Eye, EyeOff } from "lucide-react";
import useFetch from "../hooks/useFetch";
import {
  validatePassword,
  validatePasswordMatch,
} from "../util/AuthValidation";

const ChangePassword = forwardRef(function ChangePassword(
  { onKeyDown, onInputChange },
  ref,
) {
  const currentPasswordInputRef = useRef(null);
  const newPasswordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);

  const { performFetch } = useFetch("/users/change-password");

  async function handlePasswordChange() {
    const currentPassword = currentPasswordInputRef?.current?.value || "";
    const newPassword = newPasswordInputRef?.current?.value || "";
    const confirmPassword = confirmPasswordInputRef?.current?.value || "";

    if (
      !(newPassword && confirmPassword && currentPassword) &&
      (newPassword || confirmPassword || currentPassword)
    ) {
      return {
        error: "To change your password, please fill in all fields.",
        hasChanges: false,
      };
    }
    if (!validatePassword(newPassword)) {
      return {
        error:
          "Password must be at least 8 characters and meet at least 2 complexity rules.",
        hasChanges: true,
      };
    }
    const matchCheck = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchCheck.valid) {
      return { error: matchCheck.message, hasChanges: true };
    }

    // Attempt to change password
    try {
      await performFetch({
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      // Clear password fields
      currentPasswordInputRef.current.value = "";
      newPasswordInputRef.current.value = "";
      confirmPasswordInputRef.current.value = "";

      return { error: null, hasChanges: true };
    } catch (err) {
      return {
        error: err.message || "Failed to change password.",
        hasChanges: true,
      };
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
