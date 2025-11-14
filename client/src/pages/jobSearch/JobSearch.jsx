import { Link } from "react-router-dom";
import SearchInput from "../../components/SearchInput.jsx";
import "./JobSearch.css";
import { icons } from "../../assets/index.js";
import { defaultUser } from "../../data/defaultUser.js";
import { formatAddress } from "../../data/defaultUser.js";
import { UseUser } from "../../context/UserContext.jsx";

export default function JobSearch() {
  const displayedSkills = defaultUser.skills.slice(0, 3).join(", ");
  const { user } = UseUser();

  return (
    <div className="job-search-container">
      <div className="mission-section">
        <h1>Master navigating the sea of irrelevant jobs with JobCompass</h1>
        <p className="subtitle">
          Drop your anchor. Tell us your role, location, and commute time, we’ll
          steer you to the right job.
        </p>
      </div>
      <SearchInput />
      {user && user.email === defaultUser.email && (
        <div className="guest-notice">
          <img src={icons.info} alt="info" className="info-icon" />
          <span>
            Guest mode is limited to default settings — general skills such as{" "}
            {displayedSkills.toLowerCase()}, and others, along with the guest’s
            home address ({formatAddress(defaultUser.address)}).
          </span>{" "}
          <Link to="/login" className="login-link">
            Log in
          </Link>
          <span> to get more relevant results!</span>
        </div>
      )}
    </div>
  );
}
