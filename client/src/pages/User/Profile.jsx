import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SkillsSettings from "../../components/SkillsSettings";
import AddressSettings from "../../components/AddressSettings";
import AlertMessage from "../../components/AlertMessage";
import { cleanUpText } from "../../util/cleanUpText";
import { validateAddressTextInputs } from "../../util/addressTextsValidation";
import { validateHouseNoInput } from "../../util/addressHouseNoValidation";
import { UseUser } from "../../context/UserContext";
import {
  validatePassword,
  validatePasswordMatch,
} from "../../util/AuthValidation";
import { Eye, EyeOff } from "lucide-react";
export default function Profile() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ type: "", message: "" });
  const firstnameInputRef = useRef(null);
  const lastnameInputRef = useRef(null);
  const currentPasswordInputRef = useRef(null);
  const newPasswordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const streetInputRef = useRef(null);
  const houseInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const countryInputRef = useRef(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const { user, updateProfile, deleteUser, changePassword } = UseUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);
  const [newPassword, setNewPassword] = useState(false);

  //  SHOW DELETE CONFIRM POPUP
  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  //  USER CONFIRMS DELETE
  const handleConfirmDelete = async () => {
    try {
      await deleteUser();
      setDeleteSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to delete account. Please try again later.");
      setShowDeletePopup(false);
    }
  };

  //  CANCEL DELETE
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
  };

  useEffect(() => {
    if (user) {
      if (firstnameInputRef.current)
        firstnameInputRef.current.value = user?.firstname || "";
      if (lastnameInputRef.current)
        lastnameInputRef.current.value = user?.lastname || "";
      if (streetInputRef.current)
        streetInputRef.current.value = user?.street || "";
      if (houseInputRef.current)
        houseInputRef.current.value = user?.housenumber || "";
      if (cityInputRef.current) cityInputRef.current.value = user?.city || "";
      if (countryInputRef.current)
        countryInputRef.current.value = user?.country || "";
    }
  }, [user]);

  function handleClearAlert() {
    if (!alert.message) return;
    setAlert({ type: "", message: "" });
  }

  async function handleSaveClick() {
    handleClearAlert();

    const firstnameEl = firstnameInputRef.current;
    const lastnameEl = lastnameInputRef.current;
    const currentPasswordEl = currentPasswordInputRef.current;
    const newPasswordEl = newPasswordInputRef.current;
    const confirmPasswordEl = confirmPasswordInputRef.current;
    const streetEl = streetInputRef.current;
    const housenumberEl = houseInputRef.current;
    const cityEl = cityInputRef.current;
    const countryEl = countryInputRef.current;

    if (
      !firstnameEl ||
      !lastnameEl ||
      !streetEl ||
      !housenumberEl ||
      !cityEl ||
      !countryEl
    ) {
      setAlert({
        type: "error",
        message: "Error: Input fields references are missing.",
      });
      return;
    }

    if (user) {
      const updatedFields = {};

      const firstname = cleanUpText(firstnameEl.value || "");
      const lastname = cleanUpText(lastnameEl.value || "");

      // FIX: Use String() for comparison to ensure changes are detected even if the value is null or undefined
      const currentFirstName = String(user.firstname || "");
      const currentLastName = String(user.lastname || "");

      if (String(firstname) !== currentFirstName)
        updatedFields.firstname = firstname;
      if (String(lastname) !== currentLastName)
        updatedFields.lastname = lastname;

      const newPassword = newPasswordEl.value || "";
      const confirmPassword = confirmPasswordEl.value || "";
      const currentPassword = currentPasswordEl.value || "";

      // --- Password change handling ---
      if (newPassword || confirmPassword || currentPassword) {
        if (!currentPassword) {
          setAlert({
            type: "error",
            message: "Current password is required to change password.",
          });
          return;
        }

        // Validate password strength
        if (!validatePassword(newPassword)) {
          setAlert({
            type: "error",
            message:
              "Password must be at least 8 characters and meet at least 2 complexity rules.",
          });
          return;
        }

        // Validate password match
        const matchCheck = validatePasswordMatch(newPassword, confirmPassword);
        if (!matchCheck.valid) {
          setAlert({ type: "error", message: matchCheck.message });
          return;
        }

        // Call API
        try {
          await changePassword(currentPassword, newPassword);

          setAlert({
            type: "success",
            message: "Password updated successfully!",
          });

          // Clear input fields
          currentPasswordEl.value = "";
          newPasswordEl.value = "";
          confirmPasswordInputRef.current.value = "";
          return;
        } catch (err) {
          setAlert({
            type: "error",
            message: err.message || "Failed to change password.",
          });
          return;
        }
      }

      const street = cleanUpText(streetEl.value || "");
      const housenumber = cleanUpText(housenumberEl.value || "");
      const city = cleanUpText(cityEl.value || "");
      const country = cleanUpText(countryEl.value || "");

      const streetValidationError = validateAddressTextInputs({ text: street });
      const cityValidationError = validateAddressTextInputs({
        text: city,
        type: "city",
      });
      const countryValidationError = validateAddressTextInputs({
        text: country,
        type: "country",
      });
      const houseValidationError = validateHouseNoInput({ text: housenumber });

      if (
        streetValidationError ||
        cityValidationError ||
        countryValidationError ||
        houseValidationError
      ) {
        setAlert(
          streetValidationError ||
            cityValidationError ||
            countryValidationError ||
            houseValidationError,
        );
        return;
      }

      // Compare against the top-level address fields
      const currentStreet = String(user?.street);
      const currentCity = String(user?.city);
      const currentCountry = String(user?.country);
      const currentHouseNo = String(user?.housenumber || "");

      if (String(street) !== currentStreet) updatedFields.street = street;
      if (String(city) !== currentCity) updatedFields.city = city;
      if (String(country) !== currentCountry) updatedFields.country = country;

      if (String(housenumber) !== currentHouseNo)
        updatedFields.housenumber = housenumber;

      if (Object.keys(updatedFields).length === 0) {
        setAlert({ type: "info", message: "No changes detected." });
        return;
      }

      try {
        await updateProfile(updatedFields);
        setAlert({ type: "success", message: "Profile updated successfully!" });

        if (newPassword) {
          currentPasswordEl.value = "";
          newPasswordEl.value = "";
          confirmPasswordInputRef.current.value = "";
        }
      } catch (error) {
        setAlert({
          type: "error",
          message: error.message || "Failed to save profile. Check connection.",
        });
      }
    }
  }

  function pressEnterKey(e) {
    if (e.key === "Enter") handleSaveClick();
  }
  return (
    <div className="content-container">
      {/* <!-- Page Title --> */}
      <h1 className="text-2xl font-semibold text-center text-gray-900 mb-8">
        Profile
      </h1>
      {/* <!-- Profile Section with Avatar and Name --> */}
      <div className="flex items-start space-x-4">
        {/* <!-- Avatar with the editing/updating button --> */}
        <div className="relative">
          <div className="w-20 h-20 bg-gray-300 rounded flex-shrink-0 overflow-hidden">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50">
            <svg
              className="w-3 h-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex-grow">
          {/* <!-- First and Last Name --> */}
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Name
          </label>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                First Name
              </label>
              <input
                ref={firstnameInputRef}
                type="text"
                defaultValue={user.firstname}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={pressEnterKey}
                onChange={handleClearAlert}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Last Name
              </label>
              <input
                ref={lastnameInputRef}
                type="text"
                defaultValue={user.lastname}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={pressEnterKey}
                onChange={handleClearAlert}
              />
            </div>
          </div>
        </div>
      </div>
      <AddressSettings
        streetInputRef={streetInputRef}
        houseInputRef={houseInputRef}
        cityInputRef={cityInputRef}
        countryInputRef={countryInputRef}
        clearAlert={handleClearAlert}
      />
      <label className="block text-sm font-medium text-gray-900 mb-3">
        Change Password
      </label>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Type Your Current Password
          </label>
          <div className="input-wrapper">
            <input
              id="currentPasswordInput"
              ref={currentPasswordInputRef}
              type={showPassword ? "text" : "password"}
              placeholder="Type 8 characters or more"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={pressEnterKey}
              onChange={handleClearAlert}
              style={{ paddingRight: "35px" }}
            />
            {showPassword ? (
              <EyeOff
                size={18}
                className="input-icon-right-password"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                size={18}
                className="input-icon-right-password"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Set New Password
          </label>
          <div className="input-wrapper">
            <input
              id="newPasswordInput"
              ref={newPasswordInputRef}
              type={newPassword ? "text" : "password"}
              placeholder="Type 8 characters or more"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={pressEnterKey}
              onChange={handleClearAlert}
              style={{ paddingRight: "35px" }}
            />
            {newPassword ? (
              <EyeOff
                size={18}
                className="input-icon-right-password"
                onClick={() => setNewPassword(false)}
              />
            ) : (
              <Eye
                size={18}
                className="input-icon-right-password"
                onClick={() => setNewPassword(true)}
              />
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Confirm Password
          </label>
          <div className="input-wrapper">
            <input
              id="confirmPasswordInput"
              ref={confirmPasswordInputRef}
              type={showConfirmationPassword ? "text" : "password"}
              placeholder="Write the same password again"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={pressEnterKey}
              onChange={handleClearAlert}
              style={{ paddingRight: "35px" }}
            />
            {showConfirmationPassword ? (
              <EyeOff
                size={18}
                className="input-icon-right-password"
                onClick={() => setShowConfirmationPassword(false)}
              />
            ) : (
              <Eye
                size={18}
                className="input-icon-right-password"
                onClick={() => setShowConfirmationPassword(true)}
              />
            )}
          </div>
        </div>
      </div>
      {/* <!-- Save Button --> */}
      <div className="flex items-center justify-end mb-8 space-x-4">
        {alert.message && (
          <div className="md:w-auto">
            <AlertMessage type={alert.type} message={alert.message} />
          </div>
        )}
        <div>
          <button
            id="saveBtn"
            onClick={handleSaveClick}
            className="bg-blue-500 text-white text-2xl px-6 py-3 rounded hover:bg-blue-600 transition font-medium"
          >
            Save
          </button>
        </div>
      </div>
      <SkillsSettings />
      <hr className="border-gray-300 mb-8" />
      {/* <!-- Profile Deletion Section --> */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">Delete Profile</h3>
          <p className="text-sm text-gray-600">
            Permanently delete your account and data.
          </p>
        </div>
        <button
          onClick={handleDeleteClick}
          className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium"
        >
          Delete Profile
        </button>
      </div>
      {/* DELETE CONFIRM POPUP */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            {!deleteSuccess ? (
              <>
                <h2>Are you sure?</h2>
                <p>This will permanently delete your account.</p>
                <div className="popup-buttons">
                  <button
                    className="btn-secondary"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleConfirmDelete}>
                    OK
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Account Deleted</h2>
                <p>
                  Your account has been deleted successfully.
                  <br />
                  Redirecting to login...
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
