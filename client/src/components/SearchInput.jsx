import { useState } from "react";
import AlertMessage from "../components/AlertMessage";
import { validateJobInput } from "../util/validation";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import "./SearchInput.css";

export default function SearchInput() {
  const { searchTerm, setSearchTerm, setShowResults } = useJobs();
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!navigator.onLine) {
      setAlert({ type: "error", message: "No internet connection." });
      return;
    }

    const validationError = validateJobInput({ text: searchTerm });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    setAlert({ type: "info", message: `Searching for "${searchTerm}"...` });
    setLoading(true);
    setShowResults(true);
    navigate("/jobs");
    setLoading(false);
  };

  return (
    <div className="search-container">
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter a job title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className={alert.type === "error" ? "input error" : "input"}
        />
        <button
          className="search-btn"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <AlertMessage type={alert.type} message={alert.message} />
    </div>
  );
}
