import { createContext, useContext, useState } from "react";

const JobsContext = createContext();

const JobsProvider = ({ children }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); //  global search term
  const [showResults, setShowResults] = useState(false); //control when results appear

  return (
    <JobsContext.Provider
      value={{
        allJobs,
        setAllJobs,
        isLoading,
        setIsLoading,
        error,
        setError,
        searchTerm,
        setSearchTerm,
        showResults,
        setShowResults,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

const UseJobs = () => useContext(JobsContext);

export { JobsProvider, UseJobs };
