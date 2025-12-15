import { useState, useRef, useEffect } from "react";
import SkillsSettings from "../../components/SkillsSettings/SkillsSettings";
import AddressSettings from "../../components/AddressSettings/AddressSettings";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import ChangePassword from "../../components/ChangePassword";
import { cleanUpText } from "../../util/cleanUpText";
import { validateAddressTextInputs } from "../../util/addressTextsValidation";
import { validateHouseNoInput } from "../../util/addressHouseNoValidation";
import { UseUser } from "../../context/UserContext";
import AvatarUploader from "../../components/AvatarUploader/AvatarUploader";
import DeleteProfilePopup from "../../components/DeleteProfilePopup/DeleteProfilePopup";
import "./Profile.css";

export default function Profile() {
  const [alert, setAlert] = useState({ type: "", message: "" });
  const firstnameInputRef = useRef(null);
  const lastnameInputRef = useRef(null);
  const changePasswordRef = useRef(null);
  const streetInputRef = useRef(null);
  const houseInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const countryInputRef = useRef(null);
  const { user, updateProfile } = UseUser();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

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

  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  async function handleSaveClick() {
    handleClearAlert();

    const firstnameEl = firstnameInputRef.current;
    const lastnameEl = lastnameInputRef.current;
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

    // Handle password change first
    if (changePasswordRef.current?.handlePasswordChange) {
      const passwordResult =
        await changePasswordRef.current.handlePasswordChange();
      if (passwordResult.hasChanges) {
        // Password change was attempted, return regardless of success
        return;
      }
      // No password changes, continue with profile update
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
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>

      <div className="profile-avatar-row">
        {/* <!-- Avatar with the editing/updating button --> */}
        <AvatarUploader
          user={user}
          updateProfile={updateProfile}
          setAlert={setAlert}
        />
        <div className="avatar-uploader-info">
          <h3 className="avatar-uploader-title">Profile photo</h3>
          <span className="avatar-uploader-subtitle">
            Upload a new profile picture
          </span>
        </div>
      </div>

      <div className="flex-grow">
        {/* <!-- First and Last Name --> */}
        <h3 className="basic-info-title">Basic information</h3>
        <div className="profile-fields">
          <div className="profile-info-left">
            <label className="profile-field-label">First name</label>
            <input
              ref={firstnameInputRef}
              type="text"
              defaultValue={user?.firstname || ""}
              className="profile-input"
              onKeyDown={pressEnterKey}
              onChange={handleClearAlert}
            />
          </div>
          <div className="profile-info">
            <label className="profile-field-label">Last name</label>
            <input
              ref={lastnameInputRef}
              type="text"
              defaultValue={user?.lastname || ""}
              className="profile-input"
              onKeyDown={pressEnterKey}
              onChange={handleClearAlert}
            />
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3 className="profile-section-title">Address</h3>
        <AddressSettings
          streetInputRef={streetInputRef}
          houseInputRef={houseInputRef}
          cityInputRef={cityInputRef}
          countryInputRef={countryInputRef}
          clearAlert={handleClearAlert}
        />
      </div>

      <ChangePassword
        ref={changePasswordRef}
        onKeyDown={pressEnterKey}
        onInputChange={handleClearAlert}
        setAlert={setAlert}
      />
      {/* <!-- Save Button --> */}
      <div className="profile-save-row">
        {alert.message && (
          <div className="md:w-auto">
            <AlertMessage type={alert.type} message={alert.message} />
          </div>
        )}
        <div>
          <button
            id="saveBtn"
            onClick={handleSaveClick}
            className="profile-save-btn"
          >
            Save
          </button>
        </div>
      </div>
      <SkillsSettings />
      {/* DELETE PROFILE */}
      <div className="profile-delete-row">
        <div>
          <h3 className="profile-delete-title">Delete profile</h3>
          <p className="profile-delete-desc">
            Permanently delete your account and data.
          </p>
        </div>
        <button onClick={handleDeleteClick} className="profile-delete-btn">
          Delete profile
        </button>
      </div>
      {showDeletePopup && (
        <DeleteProfilePopup setShowDeletePopup={setShowDeletePopup} />
      )}
    </div>
  );
}
