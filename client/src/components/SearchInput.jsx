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

  useEffect(() => {
    if (alert.message && searchTerm) {
      setAlert({ type: "", message: "" });
    }
  }, [searchTerm]);

  const { performFetch } = useFetch(`/connect?q=${searchTerm}`, (response) => {
    setAllJobs(response.result);
  });

  const handleSearch = async () => {
    const validationError = validateJobInput({ text: searchTerm });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAlert({ type: "info", message: `Searching for "${searchTerm}"...` });

    try {
      await performFetch();
      setShowResults(true);
      navigate("/jobs");
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
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
