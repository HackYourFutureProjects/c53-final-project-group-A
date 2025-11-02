import { Link } from "react-router-dom";
import SearchInput from "../../components/SearchInput";
import "./HomePage.css";
import { icons } from "../../assets";
import { defaultUser } from "../../data/defaultUser.js";
import { formatAddress } from "../../data/defaultUser.js";

export default function HomePage() {
  const displayedSkills = defaultUser.skills.slice(0, 3).join(", ");

  return (
    <div className="homepage-container">
      <div className="mission-section">
        <h1>Master navigating the sea of irrelevant jobs with JobCompass</h1>
        <p className="subtitle">
          Drop your anchor. Tell us your role, location, and commute time, we’ll
          steer you to the right job.
        </p>
      </div>
      <SearchInput />

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
    </div>
  );
}
