import { useState } from "react";
import AlertMessage from "../components/AlertMessage";
import { validateJobInput } from "../util/validation";
import "./SearchInput.css";
import { useNavigate } from "react-router-dom";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) {
      setAlert({ type: "error", message: "Please enter a job title." });
      return;
    }
    const validationError = validateJobInput({ text: query });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    setAlert({ type: "", message: "" });
    navigate("/jobs", { state: { jobTitle: query } });
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
