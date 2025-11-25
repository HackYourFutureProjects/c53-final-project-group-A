import { useEffect, useMemo, useState } from "react";
import { gif } from "../../assets/index.js";
import DropdownFilter from "../../components/DropdownFilter/DropdownFilter";
import JobCard from "../../components/JobCard/JobCard";
import Pagination from "../../components/Pagination/Pagination";
import { UseUser } from "../../context/UserContext";
import "./OpenPositions.css";
import { findFilterOptions, filterJobs } from "../../util/filterJobs";
// import { defaultUser, formatAddress } from "../../data/defaultUser";
// removed UseUser import; JobCard now uses favorites from context directly

// WE TEMPORARY UNLINKED FILE sortAndFilterJobs FROM THE OpenPositions FOR DEBUGGING
// PLEASE UNCOMMENT NEXT 1 LINE AFTER IMPLEMENTING SORTING AND FILTERING
// import { sortAndFilterJobs } from "../../util/sortingAndFiltering";

import "./OpenPositions.css";
import SkillsSettings from "../../components/SkillsSettings";
import { UseJobs } from "../../context/JobsContext.jsx";

export default function OpenPositions() {
  const { user, dispatch, toggleFavorite } = UseUser();

  const {
    allJobs,
    searchTerm,
    isJobsLoading,
    isTravelLoading,
    error,
    fetchBatchTravelDetails,
  } = UseJobs();

  const favorites = Array.isArray(user?.favorites) ? user.favorites : [];

  // PLEASE UNCOMMENT NEXT 1 LINE AFTER IMPLEMENTING SORTING AND FILTERING
  // const { allJobs, searchTerm, showResults } = UseJobs();

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const [activeFilters, setActiveFilters] = useState({
    seniorityLevel: new Set(),
    employmentType: new Set(),
    work_mode: new Set(),
  });

  const filterOptions = useMemo(() => {
    return findFilterOptions(allJobs);
  }, [allJobs]);

  const handleFilterChange = (filterKey, value, isChecked) => {
    setActiveFilters((prev) => {
      const newSet = new Set(prev[filterKey]);
      isChecked ? newSet.add(value) : newSet.delete(value);
      setCurrentPage(1);
      return { ...prev, [filterKey]: newSet };
    });
  };

  const handleClearFilters = () => {
    setActiveFilters({
      seniorityLevel: new Set(),
      employmentType: new Set(),
      work_mode: new Set(),
    });
    setCurrentPage(1);
  };

  const filteredJobs = useMemo(() => {
    return filterJobs(allJobs, activeFilters);
  }, [allJobs, activeFilters]);

  //pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  useEffect(() => {
    if (currentJobs.length > 0) {
      fetchBatchTravelDetails(currentJobs);
    }
  }, [currentPage, activeFilters]);

  console.log(favorites);

  return (
    <div className="open-positions content-container">
      {isJobsLoading && (
        <div className="loader-overlay">
          <img src={gif.boat} alt="Loading..." className="loader-gif" />
        </div>
      )}

      <div className="open-positions">
        <SkillsSettings />
        <div className="job-filters-bar">
          <div className="filters-container">
            <div className="filter-dropdowns">
              <DropdownFilter
                buttonText="Experience level"
                title="Experience level"
                options={filterOptions.experienceOptions}
                filterKey="seniorityLevel"
                activeValues={activeFilters.seniorityLevel}
                onFilterChange={handleFilterChange}
              />
              <DropdownFilter
                buttonText="Job type"
                title="Job type"
                options={filterOptions.jobTypeOptions}
                filterKey="employmentType"
                activeValues={activeFilters.employmentType}
                onFilterChange={handleFilterChange}
              />
              <DropdownFilter
                buttonText="Work mode"
                title="Work mode"
                options={filterOptions.workModeOptions}
                filterKey="work_mode"
                activeValues={activeFilters.work_mode}
                onFilterChange={handleFilterChange}
              />
              {/* <DropdownFilter
                buttonText="Sort by"
                title="Sort by"
                options={sortOptions}
                filterKey="sort"
                activeValues={sortBy}
                onFilterChange={(filterKey, value) =>
                  handleSortChange(filterKey, value)
                }
              /> */}
            </div>
            <button onClick={handleClearFilters} className="clear-filters-btn">
              Clear filters
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            Error loading commute info: {error}
          </div>
        )}

        {!isJobsLoading && filteredJobs.length === 0 && (
          <p className="job-message">
            No jobs are shown. Go to <strong>Job Search</strong> or{" "}
            <strong>Clear Filters</strong> to see more results.
          </p>
        )}

        {!isJobsLoading && filteredJobs.length > 0 && (
          <>
            <p className="job-message">
              Showing {filteredJobs.length} jobs in total{" "}
              {searchTerm && `for "${searchTerm}"`}
            </p>
            <ul className="jobs-list">
              {currentJobs.map((job, idx) => (
                <JobCard
                  key={job.id || idx}
                  job={job}
                  isTravelLoading={isTravelLoading}
                  isInFavorites={favorites.some((fav) => fav.id === job.id)}
                  dispatch={dispatch}
                  toggleFavorite={toggleFavorite}
                  user={user}
                  onApplyClick={(url) => window.open(url, "_blank")}
                />
              ))}
            </ul>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
