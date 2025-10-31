import { useState } from "react";
import AlertMessage from "../components/AlertMessage";
import { validateJobInput } from "../util/validation";
import NorthHolland from "../assets/NorthHolland.json";
import { useNavigate } from "react-router-dom";
import "./SearchInput.css";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    setAlert({ type: "info", message: `Searching for "${query}"...` });
    setLoading(true);

    const filteredJobs = NorthHolland.filter((job) =>
      job.title.toLowerCase().includes(query.toLowerCase()),
    );

    navigate("/user/jobs", { state: { jobs: filteredJobs } });
    setLoading(false);
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
    </div>
  );
}
