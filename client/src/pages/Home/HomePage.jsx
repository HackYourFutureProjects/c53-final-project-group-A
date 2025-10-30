import { Link } from "react-router-dom";
import SearchInput from "../../components/SearchInput";
import "./HomePage.css";
import { icons } from "../../assets";

export default function HomePage() {
  return (
    <div className="homepage-container">
      <div className="mission-section">
        <h1>Master navigating the sea of irrelevant jobs with JobCompass</h1>
        <p className="subtitle">
          Drop your anchor. Tell us your role, location, and commute time we’ll
          steer you to the right job.
        </p>
      </div>
      <h2>Search for Jobs</h2>
      <SearchInput />

      <div className="guest-notice">
        <img src={icons.info} alt="info" className="info-icon" />
        <span>
          Guest mode is limited by default settings: North Holland and skills:
          communication, adaptability and teamwork.
        </span>

        <Link to="/login" className="login-link">
          Log in
        </Link>
        <span> to get more relevant results!</span>
      </div>
    </div>
  );
}
