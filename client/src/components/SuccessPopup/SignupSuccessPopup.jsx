import "./SuccessPopup.css";
import { UseUser } from "../../context/UserContext";

const SignupSuccessPopup = ({ goToProfile }) => {
  const { user } = UseUser();
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h2>Welcome {user?.firstname}</h2>
        <p>
          You successfully signed up and logged in! Manage your skill set and
          address in your profile to get the most relevant jobs.
        </p>
        <div className="popup-buttons">
          <button className="btn-primary" onClick={goToProfile}>
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccessPopup;
