import { useEffect } from "react";
import { UseUser } from "../../context/UserContext";
import "./DeleteProfilePopup.css";
import useFetch from "../../hooks/useFetch";
import { gif } from "../../assets";

export default function DeleteProfilePopup({ setShowDeletePopup }) {
  const { user, dispatch, setMessage } = UseUser();

  const { isLoading, error, performFetch } = useFetch(
    `/users/delete/${user.id}`,
    (data) => {
      setMessage(data.msg || "Account deleted successfully!");
      setTimeout(() => {
        dispatch({ type: "LOGOUT" });
      }, 2000);
    },
  );

  useEffect(() => {
    if (error) {
      console.error(error);
      setMessage("Failed to delete account. Please try again later.");
      setShowDeletePopup(false);
    }
  }, [error]);

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup-card">
        <h2>Are you sure?</h2>
        <p>This will permanently delete your account.</p>
        <div className="profile-popup-buttons">
          <button
            className="profile-btn-secondary"
            onClick={() => setShowDeletePopup(false)}
          >
            Cancel
          </button>
          <button
            className="profile-btn-primary"
            onClick={() =>
              performFetch({ method: "DELETE", credentials: "include" })
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span>Deleting...</span>
                <img src={gif.spinner} alt="Loading..." className="spinner" />
              </>
            ) : (
              "OK"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
