import SearchInput from "../components/SearchInput";
import "./HomePage.css";

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
    </div>
  );
}
