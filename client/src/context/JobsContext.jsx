import { UseUser } from "./UserContext";
import { createContext, useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import { defaultUser, formatAddress } from "../data/defaultUser";
import { getCitiesToFetch } from "../../../server/src/util/getCitiesToFetch";

const JobsContext = createContext();

const JobsProvider = ({ children }) => {
  const { user } = UseUser();
  const [allJobs, setAllJobs] = useState([]);
  const [isJobsLoading, setIsJobsLoading] = useState(false);
  const [isTravelLoading, setIsTravelLoading] = useState(false);
  const [travelDetails, setTravelDetails] = useState({});
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); //  global search term
  const [showResults, setShowResults] = useState(false); //control when results appear

  const handleFetchResults = (data) => {
    setAllJobs(data.result);
    setIsJobsLoading(false);
    fetchBatchTravelDetails(data.result);
  };

  const { performFetch } = useFetch("/jobs/search", handleFetchResults);

  async function fetchJobWordsBySearchWords(searchWords) {
    setError(null);
    setIsJobsLoading(true);

    performFetch({
      method: "POST",
      body: JSON.stringify({ search_terms: searchWords.join(" ") }),
    });
  }

  async function fetchBatchTravelDetails(jobsArray) {
    setIsTravelLoading(true);

    const citiesToFetch = getCitiesToFetch(jobsArray, travelDetails);

    const homeAddress = user?.address
      ? formatAddress(user.address)
      : formatAddress(defaultUser.address);

    if (!homeAddress || !citiesToFetch.length) {
      setError(
        "The address or cities for route calculation are not specified.",
      );
      setIsTravelLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/travel/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeAddress, workCities: citiesToFetch }),
      });
      const data = await res.json();

      const detailsMap = { ...travelDetails };
      if (data.result && Array.isArray(data.result.travelDetails)) {
        data.result.travelDetails.forEach((item) => {
          detailsMap[item.workCity] = item;
        });
      }
      setTravelDetails(detailsMap);
    } catch (error) {
      setError("Failed to load travel details");
      console.error(error);
    } finally {
      setIsTravelLoading(false);
    }
  }

  function getJobsWithTravel() {
    return allJobs.map((job) => {
      const city = job.cities_derived?.[0];

      return {
        ...job,
        travelInfo: travelDetails[city],
      };
    });
  }

  return (
    <JobsContext.Provider
      value={{
        allJobs: getJobsWithTravel(),
        setAllJobs,
        isJobsLoading,
        isTravelLoading,
        error,
        setError,
        searchTerm,
        setSearchTerm,
        showResults,
        setShowResults,
        fetchJobWordsBySearchWords,
        fetchBatchTravelDetails,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

const UseJobs = () => useContext(JobsContext);

export { JobsProvider, UseJobs };
