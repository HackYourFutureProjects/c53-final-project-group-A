import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { UseJobs } from "../context/JobsContext";
import AlertMessage from "../components/AlertMessage";
import { validateJobInput } from "../util/searchValidation";
import "./SearchInput.css";
import { cleanUpText } from "../util/cleanUpText";

export default function SearchInput() {
  const { searchTerm, setSearchTerm, setShowResults, setAllJobs, setError } =
    UseJobs();

  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  //post route
  const { performFetch } = useFetch("/jobs/search", (data) => {
    setAllJobs(data.result);
  });

  const handleSearch = async () => {
    const validationError = validateJobInput({ text: cleanUpText(searchTerm) });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    setAllJobs([]);
    setError(null);
    setAlert({ type: "info", message: `Searching for "${searchTerm}"...` });

    performFetch({
      method: "POST",
      body: JSON.stringify({ search_terms: searchTerm }),
    });

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
