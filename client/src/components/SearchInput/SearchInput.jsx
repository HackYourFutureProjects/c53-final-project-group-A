import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UseJobs } from "../../context/JobsContext";
import AlertMessage from "../AlertMessage/AlertMessage";
import { validateJobInput } from "../../util/searchValidation";
import "./SearchInput.css";
import { cleanUpText } from "../../util/cleanUpText";

export default function SearchInput() {
  const { setSearchTerm, setAllJobs, fetchJobWordsBySearchWords } = UseJobs();

  const [alert, setAlert] = useState({ type: "", message: "" });
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const inputValue = inputRef.current?.value ?? "";
    const validationError = validateJobInput({ text: cleanUpText(inputValue) });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    setAllJobs([]);
    setAlert({ type: "info", message: `Searching for "${inputValue}"...` });
    setSearchTerm(inputValue);
    fetchJobWordsBySearchWords(inputValue);
    navigate("/jobs");
    // clear the visible input field while keeping `searchTerm` in context
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="search-input">
      <label htmlFor="job-search" className="search-label">
        Enter job title
      </label>
      <div className="input-group">
        <input
          ref={inputRef}
          id="job-search"
          type="text"
          placeholder="e.g. web developer"
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
