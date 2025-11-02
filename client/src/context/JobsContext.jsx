import { createContext, useContext, useState, useEffect } from "react";
import NorthHolland from "../assets/NorthHolland.json";

const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); //  global search term
  const [showResults, setShowResults] = useState(false); //control when results appear

  useEffect(() => {
    // asynchronous to avoid React warning about synchronous setState in useEffect
    const timer = setTimeout(() => {
      setAllJobs(NorthHolland);
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <JobsContext.Provider
      value={{
        allJobs,
        isLoading,
        searchTerm,
        setSearchTerm,
        showResults,
        setShowResults,
      }} // provide new state
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => useContext(JobsContext);
