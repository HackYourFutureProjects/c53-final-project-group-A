import "./SuccessPopup.css";
const SignupSuccessPopup = ({ user, onClose, goToProfile }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h2>Welcome {user}</h2>
        <p>
          You successfully signed up! Manage your skill set and address in your
          profile to get the most relevant jobs.
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

export default SignupSuccessPopup;
