import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassword({
  currentPasswordInputRef,
  newPasswordInputRef,
  confirmPasswordInputRef,
  onKeyDown,
  onInputChange,
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);

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
}
