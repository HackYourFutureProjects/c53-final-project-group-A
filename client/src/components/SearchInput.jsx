import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { UseJobs } from "../context/JobsContext";
import AlertMessage from "../components/AlertMessage";
import { validateJobInput } from "../util/validation";
import "./SearchInput.css";

export default function SearchInput() {
  const {
    searchTerm,
    setSearchTerm,
    setShowResults,
    setAllJobs,
    setIsLoading,
    setError,
  } = UseJobs();

  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  //post route
  const {
    performFetch,
    isLoading: isFetchLoading,
    cancelFetch,
  } = useFetch("/jobs/search", (data) => {
    setAllJobs((prevJobs) => {
      const newJobs = [...prevJobs, ...data.result];

      const uniqueJobs = new Map(newJobs.map((job) => [job.job_id, job]));
      return Array.from(uniqueJobs.values());
    });
  });

  useEffect(() => {
    return cancelFetch;
  }, []);

  useEffect(() => {
    setIsLoading(isFetchLoading);
  }, [isFetchLoading, setIsLoading]);

  const handleSearch = () => {
    const validationError = validateJobInput({ text: searchTerm });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    setAllJobs([]);
    setError(null);
    setAlert({ type: "info", message: `Searching for "${searchTerm}"...` });

    const searchWords = searchTerm.trim().split(/\s+/);
    searchWords.forEach((word) => {
      performFetch({
        method: "POST",
        body: JSON.stringify({ search_terms: word.trim() }),
      });
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
