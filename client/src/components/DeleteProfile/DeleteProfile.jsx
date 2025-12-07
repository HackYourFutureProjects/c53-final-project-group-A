import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { UseUser } from "../../context/UserContext";
import "./DeleteProfile.css";

export default function DeleteProfile({ deleteUser }) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  // const navigate = useNavigate();
  // const { clearMessage } = UseUser();

  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser();
      setDeleteSuccess(true);

      // Redirect to login after 3 seconds to allow user to see success message
      // setTimeout(() => {
      //   navigate("/login");
      // }, 3000);
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
            {!deleteSuccess ? (
              <>
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
              </>
            ) : (
              <>
                <h2>Account deleted</h2>
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
    </>
  );
}
