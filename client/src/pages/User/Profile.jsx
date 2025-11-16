import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SkillsSettings from "../../components/SkillsSettings";
import AddressSettings from "../../components/AddressSettings";
import AlertMessage from "../../components/AlertMessage";
import { cleanUpText } from "../../util/cleanUpText";
import { validateAddressTextInputs } from "../../util/addressTextsValidation";
import { validateHouseNoInput } from "../../util/addressHouseNoValidation";
import { UseUser } from "../../context/UserContext";
import PopupForSave from "../../components/SuccessPopup/PopupForSave";
import { defaultUser } from "../../data/defaultUser";

export default function Profile() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showSavePopup, setShowSavePopup] = useState(false);
  const firstnameInputRef = useRef(null);
  const lastnameInputRef = useRef(null);
  const currentPasswordInputRef = useRef(null);
  const newPasswordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const streetInputRef = useRef(null);
  const houseInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const countryInputRef = useRef(null);
  const { user, dispatch } = UseUser();

  function handleClearAlert() {
    if (!alert.message) return;
    setAlert({ type: "", message: "" });
  }

  const handleLoginRedirect = () => {
    setShowSavePopup(false);
    navigate("/login", {});
  };

  function handleSaveClick(
    streetInputRef,
    houseInputRef,
    cityInputRef,
    countryInputRef,
  ) {
    let firstname = firstnameInputRef.current;
    let lastname = lastnameInputRef.current;
    let currentPassword = currentPasswordInputRef.current;
    let newPassword = newPasswordInputRef.current;
    let confirmPassword = confirmPasswordInputRef.current;
    let street = streetInputRef.current;
    let house = houseInputRef.current;
    let city = cityInputRef.current;
    let country = countryInputRef.current;
    if (!firstname || !lastname || !street || !house || !city || !country) {
      return;
    }
    if (user && user.email !== defaultUser.email) {
      // First and Last Name
      firstname = cleanUpText(firstname.value || "");
      lastname = cleanUpText(lastname.value || "");
      console.log("Saving settings for:", firstname, lastname);
      // Passwords
      newPassword = newPassword.value || "";
      confirmPassword = confirmPassword.value || "";
      if (currentPassword || newPassword || confirmPassword) {
        console.log(
          "newPassword, confirmPassword",
          newPassword,
          confirmPassword,
        );
        if (newPassword === confirmPassword) {
          console.log("Password updated.");
        } else {
          setAlert({ type: "error", message: "Passwords do not match." });
          return;
        }
      }
      // Address
      street = cleanUpText(street.value || "");
      house = cleanUpText(house.value || "");
      city = cleanUpText(city.value || "");
      country = cleanUpText(country.value || "");
      const streetValidationError = validateAddressTextInputs({
        text: street,
      });
      const cityValidationError = validateAddressTextInputs({
        text: city,
        type: "city",
      });
      const countryValidationError = validateAddressTextInputs({
        text: country,
        type: "country",
      });
      const houseValidationError = validateHouseNoInput({ text: house });
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
      dispatch({
        type: "UPDATE_USER",
        payload: {
          firstname,
          lastname,
          address: { street, houseNumber: house, city, country },
        },
      });
    } else {
      setShowSavePopup(true);
    }
  }

  function pressEnterKey(e) {
    if (e.key === "Enter")
      handleSaveClick(
        streetInputRef,
        houseInputRef,
        cityInputRef,
        countryInputRef,
      );
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
        handleSaveClick={handleSaveClick}
        streetInputRef={streetInputRef}
        houseInputRef={houseInputRef}
        cityInputRef={cityInputRef}
        countryInputRef={countryInputRef}
        clearAlert={handleClearAlert}
      />
      <SkillsSettings />
      <label className="block text-sm font-medium text-gray-900 mb-3">
        Change Password
      </label>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Type Your Current Password
          </label>
          <input
            id="currentPasswordInput"
            ref={currentPasswordInputRef}
            type="password"
            placeholder="Type 8 characters or more"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={pressEnterKey}
            onChange={handleClearAlert}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Set New Password
          </label>
          <input
            id="newPasswordInput"
            ref={newPasswordInputRef}
            type="password"
            placeholder="Type 8 characters or more"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={pressEnterKey}
            onChange={handleClearAlert}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPasswordInput"
            ref={confirmPasswordInputRef}
            type="password"
            placeholder="Write the same password again"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={pressEnterKey}
            onChange={handleClearAlert}
          />
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
            onClick={() =>
              handleSaveClick(
                streetInputRef,
                houseInputRef,
                cityInputRef,
                countryInputRef,
              )
            }
            className="bg-blue-500 text-white text-2xl px-6 py-3 rounded hover:bg-blue-600 transition font-medium"
          >
            Save
          </button>
          {/* Popup for saving settings */}
          {showSavePopup && (
            <PopupForSave
              handleLoginRedirect={handleLoginRedirect}
              setShowSavePopup={setShowSavePopup}
            />
          )}
        </div>
      </div>
      <hr className="border-gray-300 mb-8" />
      {/* <!-- Profile Deletion Section --> */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">Delete Profile</h3>
          <p className="text-sm text-gray-600">
            Permanently delete your account and data.
          </p>
        </div>
        <button className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium">
          Delete Profile
        </button>
      </div>
    </div>
  );
}
