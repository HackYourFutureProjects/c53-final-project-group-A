import { useState } from "react";
import AlertMessage from "../components/AlertMessage";
import { validateJobInput } from "../util/validation";
import { useNavigate } from "react-router-dom";
import { UseJobs } from "../context/JobsContext";
import "./SearchInput.css";

export default function SearchInput() {
  const { searchTerm, setSearchTerm, setShowResults } = UseJobs();
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleSearch = () => {
    const validationError = validateJobInput({ text: searchTerm });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    setAlert({ type: "info", message: `Searching for "${searchTerm}"...` });
    setShowResults(true);
    navigate("/jobs");
  };

  return (
    <div className="search-input">
      <label htmlFor="job-search" className="search-label">
        Enter job title
      </label>
      <div className="input-group">
        <input
          id="job-search"
          type="text"
          placeholder="e.g. Web Developer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          aria-describedby="search-alert"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {alert.message && (
        <AlertMessage type={alert.type} message={alert.message} />
      )}
    </div>
  );
}
