import "../JobCard/JobCard.css";
export default function PopupForSave({ handleLoginRedirect, setShowPopup }) {
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h2>Want to save your settings?</h2>
        <p>Log in to hop on board!</p>
        <div className="popup-buttons">
          <button className="btn-primary" onClick={handleLoginRedirect}>
            Log in
          </button>
          <button className="btn-secondary" onClick={() => setShowPopup(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
