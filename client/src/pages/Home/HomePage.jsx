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
          Drop your anchor. Tell us your role, location, and commute time, we’ll
          steer you to the right job.
        </p>
      </div>
      <SearchInput />

      <div className="guest-notice">
        <img src={icons.info} alt="info" className="info-icon" />
        <span>
          Guest mode is limited to default settings — general skills such as
          communication, adaptability, teamwork, and others, along with the
          guest’s home address (Noord-Holland, Amsterdam, Keizersgracht 123).
        </span>

        <Link to="/login" className="login-link">
          Log in
        </Link>
        <span> to get more relevant results!</span>
      </div>
    </div>
  );
}
