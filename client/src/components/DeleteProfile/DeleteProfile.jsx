import { useState } from "react";
import { UseUser } from "../../context/UserContext";
import "./DeleteProfile.css";

export default function DeleteProfile() {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const { deleteUser, dispatch, defaultUser } = UseUser();

  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser();

      setTimeout(() => {
        dispatch({ type: "LOGOUT", payload: defaultUser });
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to delete account. Please try again later.");
      setShowDeletePopup(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
  };

  return (
    <>
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
      {/* DELETE CONFIRM POPUP */}
      {showDeletePopup && (
        <div className="profile-popup-overlay">
          <div className="profile-popup-card">
            <h2>Are you sure?</h2>
            <p>This will permanently delete your account.</p>
            <div className="profile-popup-buttons">
              <button
                className="profile-btn-secondary"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="profile-btn-primary"
                onClick={handleConfirmDelete}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
