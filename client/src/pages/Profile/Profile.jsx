import { useState, useRef, useEffect } from "react";
import SkillsSettings from "../../components/SkillsSettings/SkillsSettings";
import AddressSettings from "../../components/AddressSettings/AddressSettings";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import ChangePassword from "../../components/ChangePassword";
import { cleanUpText } from "../../util/cleanUpText";
import { validateAddressTextInputs } from "../../util/addressTextsValidation";
import { validateHouseNoInput } from "../../util/addressHouseNoValidation";
import { UseUser } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import { fixUserSkills } from "../../util/fixUserSkills";
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
  const { user, dispatch } = UseUser();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  function handleClearAlert() {
    setAlert({ type: "", message: "" });
  }

  function delayedClearAlert() {
    setTimeout(() => {
      handleClearAlert();
    }, 2000);
  }

  const { error: updateProfileError, performFetch: performUpdateProfile } =
    useFetch("/users/profile", (data) => {
      dispatch({
        type: "UPDATE_USER",
        payload: {
          ...data.user,
          skills: fixUserSkills(data.user.skills),
        },
      });
      setAlert({ type: "success", message: "Profile updated successfully!" });
    });

  useEffect(() => {
    if (updateProfileError)
      setAlert({ type: "error", message: String(updateProfileError) });
    delayedClearAlert();
  }, [updateProfileError]);

  useEffect(() => {
    if (
      user &&
      firstnameInputRef &&
      lastnameInputRef &&
      streetInputRef &&
      houseInputRef &&
      cityInputRef &&
      countryInputRef
    ) {
      firstnameInputRef.current.value = user?.firstname || "";
      lastnameInputRef.current.value = user?.lastname || "";
      streetInputRef.current.value = user?.street || "";
      houseInputRef.current.value = user?.housenumber || "";
      cityInputRef.current.value = user?.city || "";
      countryInputRef.current.value = user?.country || "";
    }
  }, [user]);

  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  async function handleSaveClick() {
    handleClearAlert();

    if (
      !changePasswordRef ||
      !firstnameInputRef ||
      !lastnameInputRef ||
      !streetInputRef ||
      !houseInputRef ||
      !cityInputRef ||
      !countryInputRef
    ) {
      setAlert({
        type: "error",
        message: "Error: Input fields references are missing.",
      });
      return;
    }

    let passwordResult = { inputsFilled: false };
    passwordResult = await changePasswordRef.current.handlePasswordChange();
    if (
      passwordResult.validationError ||
      changePasswordRef.current.fetchError
    ) {
      setAlert({
        type: "error",
        message:
          passwordResult.validationError ||
          String(changePasswordRef.current.fetchError),
      });
      return;
    } else if (passwordResult.inputsFilled) {
      setAlert({
        type: "success",
        message: "Password changed successfully!",
      });
    }

    if (user) {
      const updatedFields = {};

      const firstname = cleanUpText(firstnameInputRef.current.value || "");
      const lastname = cleanUpText(lastnameInputRef.current.value || "");

      // FIX: Use String() for comparison to ensure changes are detected even if the value is null or undefined
      const currentFirstName = String(user.firstname || "");
      const currentLastName = String(user.lastname || "");

      if (String(firstname) !== currentFirstName)
        updatedFields.firstname = firstname;
      if (String(lastname) !== currentLastName)
        updatedFields.lastname = lastname;

      const street = cleanUpText(streetInputRef.current.value || "");
      const housenumber = cleanUpText(houseInputRef.current.value || "");
      const city = cleanUpText(cityInputRef.current.value || "");
      const country = cleanUpText(countryInputRef.current.value || "");

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
      if (
        Object.keys(updatedFields).length === 0 &&
        passwordResult.inputsFilled === false
      ) {
        setAlert({ type: "info", message: "No changes detected." });
        return;
      }

      performUpdateProfile({
        method: "PUT",
        body: JSON.stringify(updatedFields),
        credentials: "include",
      });
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
        <AvatarUploader setAlert={setAlert} />
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
