import { useState } from "react";
import AlertMessage from "../components/AlertMessage";
import { validateJobInput } from "../util/validation";
import "./SearchInput.css";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockJobs = [
    {
      title: "Backend Developer",
      company: "Topicus",
      location: "Utrecht, Netherlands",
      url: "https://www.werkenbijtopicus.nl/vacature/143/backend-developer",
    },
  ];

  const handleSearch = () => {
    if (!navigator.onLine) {
      setAlert({ type: "error", message: "No internet connection." });
      return;
    }

    const validationError = validateJobInput({ text: query });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    setAlert({ type: "info", message: `Searching for "${query}"...` });
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Simple filter by query
      const filteredJobs = mockJobs.filter((job) =>
        job.title.toLowerCase().includes(query.toLowerCase()),
      );

      setJobs(filteredJobs);
      setAlert({
        type: "success",
        message: `Found ${filteredJobs.length} jobs for "${query}"`,
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="search-container">
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter a job title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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

      {jobs.length > 0 && (
        <ul className="jobs-list">
          {jobs.map((job, idx) => (
            <li key={idx} className="job-item">
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                <strong>{job.title}</strong> at {job.company} ({job.location})
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
