import "./SuccessPopup.css";
const SuccessPopup = ({ user, onClose, goToProfile }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h2>Welcome {user}</h2>
        <p>
          You are signed up! You can manage your favorite jobs and profile
          settings in the profile section.
        </p>
        <div className="popup-buttons">
          <button className="btn-primary" onClick={goToProfile}>
            Go to Profile
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
