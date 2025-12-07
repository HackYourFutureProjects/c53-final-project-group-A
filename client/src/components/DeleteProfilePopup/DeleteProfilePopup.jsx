import { UseUser } from "../../context/UserContext";
import "./DeleteProfilePopup.css";
import { defaultUser } from "../../data/defaultUser";

export default function DeleteProfilePopup({ setShowDeletePopup }) {
  const { deleteUser, dispatch } = UseUser();

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
          <button className="profile-btn-primary" onClick={handleConfirmDelete}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
