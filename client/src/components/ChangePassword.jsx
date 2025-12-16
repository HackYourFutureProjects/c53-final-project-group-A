import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import useFetch from "../hooks/useFetch";
import {
  validatePassword,
  validatePasswordMatch,
} from "../util/AuthValidation";
import { gif } from "../assets/index.js";

const ChangePassword = forwardRef(function ChangePassword(
  { onKeyDown, onInputChange, onSuccess, onError },
  ref,
) {
  const currentPasswordInputRef = useRef(null);
  const newPasswordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);

  const {
    isLoading: isPasswordChangeLoading,
    error: fetchError,
    performFetch,
  } = useFetch("/users/change-password", () => {
    currentPasswordInputRef.current.value = "";
    newPasswordInputRef.current.value = "";
    confirmPasswordInputRef.current.value = "";
    if (typeof onSuccess === "function") onSuccess();
  });

  useEffect(() => {
    if (fetchError && typeof onError === "function") {
      onError(fetchError);
    }
  }, [fetchError, onError]);

  async function handlePasswordChange() {
    const currentPassword = currentPasswordInputRef?.current?.value || "";
    const newPassword = newPasswordInputRef?.current?.value || "";
    const confirmPassword = confirmPasswordInputRef?.current?.value || "";

    if (!newPassword && !confirmPassword && !currentPassword) {
      return {
        validationError: null,
        inputsFilled: false,
      };
    }
    if (!(newPassword && confirmPassword && currentPassword)) {
      return {
        validationError: "To change your password, please fill in all fields.",
        inputsFilled: true,
      };
    }
    if (!validatePassword(newPassword)) {
      return {
        validationError:
          "Password must be at least 8 characters and meet at least 2 complexity rules.",
        inputsFilled: true,
      };
    }
    const matchCheck = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchCheck.valid) {
      return { validationError: matchCheck.message, inputsFilled: true };
    }

    performFetch({
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
      credentials: "include",
    });

    return { validationError: null, inputsFilled: true };
  }

  // Expose the handlePasswordChange function and error state to parent via ref
  useImperativeHandle(ref, () => ({
    handlePasswordChange,
    fetchError,
    isPasswordChangeLoading,
  }));

  return (
    <div className="profile-section">
      <h3 className="profile-section-title">
        Change password{" "}
        {isPasswordChangeLoading && (
          <img src={gif.spinner} alt="Loading..." className="spinner" />
        )}
      </h3>
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
