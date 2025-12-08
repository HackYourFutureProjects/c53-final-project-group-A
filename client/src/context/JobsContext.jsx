import { UseUser } from "./UserContext";
import { createContext, useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

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

  // Clear jobs when user logs in/out
  useEffect(() => {
    setAllJobs([]);
    setTravelDetails({});
  }, [user.email]);

  function handleFetchResults(data) {
    setAllJobs(data.result);
    setIsJobsLoading(false);
    fetchBatchTravelDetails(data.result);
  }

  const { error: jobFetchError, performFetch } = useFetch(
    "/jobs/search",
    handleFetchResults,
  );

  useEffect(() => {
    if (jobFetchError) {
      setError(jobFetchError);
      setIsJobsLoading(false);
    }
  }, [jobFetchError]);

  async function fetchJobWordsBySearchWords(searchWords) {
    setError(null);
    setIsJobsLoading(true);

    performFetch({
      method: "POST",
      body: JSON.stringify({ search_terms: searchWords }),
    });
  }

  function getCitiesToFetch(jobsArray, travelDetails) {
    const uniqueCities = [
      ...new Set(
        jobsArray
          .map((job) => {
            const workCity = job.display_location;

            return typeof workCity === "string" && workCity.trim() !== ""
              ? workCity
              : null;
          })
          .filter(Boolean),
      ),
    ];

    return uniqueCities.filter(
      (city) => !Object.prototype.hasOwnProperty.call(travelDetails, city),
    );

    // return uniqueCities
  }

  async function fetchBatchTravelDetails(jobsArray) {
    setIsTravelLoading(true);

    const citiesToFetch = getCitiesToFetch(jobsArray, travelDetails);

    const homeAddress = {
      homeStreet: user?.street,
      homeHousenumber: user?.housenumber,
      homeCity: user?.city,
      homeCountry: user?.country,
    };

    if (citiesToFetch.length === 0) {
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
        data.result.travelDetails.forEach(
          ({ workCity, travel_time, least_transfers }) => {
            detailsMap[workCity] = {
              travel_time,
              least_transfers,
            };
          },
        );
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
      const city = job.display_location;

      return {
        ...job,
        travel_time: travelDetails[city]?.travel_time,
        least_transfers: travelDetails[city]?.least_transfers,
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
