export default function PopupShowRemoveConfirmation({
  handleLoginRedirect,
  setShowPopup,
}) {
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h2>Remove this job from favorites?</h2>
        <p>Log in to proceed.</p>
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
