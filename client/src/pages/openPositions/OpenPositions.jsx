import { useState, useMemo } from "react";
import DropdownFilter from "../../components/DropdownFilter/DropdownFilter";
import JobCard from "../../components/JobCard/JobCard";
import Pagination from "../../components/Pagination/Pagination";

// WE TEMPORARY UNLINKED FILE sortAndFilterJobs FROM THE OpenPositions FOR DEBUGGING
// import { sortAndFilterJobs } from "../../util/sortingAndFiltering";

import { UseJobs } from "../../context/JobsContext";
import { useFavorites } from "../../context/FavoritesContext";
import "./OpenPositions.css";

export default function OpenPositions() {
  const { allJobs, searchTerm, showResults } = UseJobs();
  const { favorites, toggleFavorite } = useFavorites();

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const [activeFilters, setActiveFilters] = useState({
    seniorityLevel: new Set(),
    employmentType: new Set(),
    workMode: new Set(),
  });
  const [sortBy, setSortBy] = useState("Skill match");

  const experienceOptions = [
    "Internship",
    "Entry level",
    "Associate",
    "Mid-Senior level",
    "Director",
    "Executive",
    "Not Applicable",
  ];
  const jobTypeOptions = ["Full-time", "Contract", "Part-time", "Volunteer"];
  const workModeOptions = ["On-site", "Hybrid", "Remote"];
  const sortOptions = [
    "Skill match",
    "Newest First",
    "Nearest First",
    "Fewest applicants",
    "Fewest transfers",
  ];

  const handleFilterChange = (filterKey, value, isChecked) => {
    setActiveFilters((prev) => {
      const newSet = new Set(prev[filterKey]);
      isChecked ? newSet.add(value) : newSet.delete(value);
      setCurrentPage(1);
      return { ...prev, [filterKey]: newSet };
    });
  };

  const handleSortChange = (_, value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({
      seniorityLevel: new Set(),
      employmentType: new Set(),
      workMode: new Set(),
    });
    setSortBy("Skill match");
    setCurrentPage(1);
  };

  // FOR DEBUGGING
  // const filteredJobs = allJobs;

  const filteredJobs = useMemo(() => {
    // ✅ only compute filtered jobs if showResults is true
    if (!showResults || !searchTerm.trim()) return [];
    // WE TEMPORARY UNLINKED FILE sortAndFilterJobs FROM THE OpenPositions FOR DEBUGGING
    return sortAndFilterJobs(allJobs, activeFilters, sortBy, searchTerm);
  }, [allJobs, activeFilters, sortBy, searchTerm, showResults]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div className="open-positions content-container">
      <div className="job-filters-bar">
        <div className="filters-container">
          <div className="filter-dropdowns">
            <DropdownFilter
              buttonText="Experience level"
              title="Experience level"
              options={experienceOptions}
              filterKey="seniorityLevel"
              activeValues={activeFilters.seniorityLevel}
              onFilterChange={handleFilterChange}
            />
            <DropdownFilter
              buttonText="Job type"
              title="Job type"
              options={jobTypeOptions}
              filterKey="employmentType"
              activeValues={activeFilters.employmentType}
              onFilterChange={handleFilterChange}
            />
            <DropdownFilter
              buttonText="Work mode"
              title="Work mode"
              options={workModeOptions}
              filterKey="workMode"
              activeValues={activeFilters.workMode}
              onFilterChange={handleFilterChange}
            />
            <DropdownFilter
              buttonText="Sort by"
              title="Sort by"
              options={sortOptions}
              filterKey="sort"
              activeValues={sortBy}
              onFilterChange={(filterKey, value) =>
                handleSortChange(filterKey, value)
              }
            />
          </div>
          <button onClick={handleClearFilters} className="clear-filters-btn">
            Clear filters
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="results-summary">
          <h1 className="results-title">Search results</h1>
          <p className="results-count">
            Showing **{filteredJobs.length}** results{" "}
            {searchTerm && `for "${searchTerm}"`}
          </p>
        </div>

        {filteredJobs.length === 0 ? (
          <p className="no-jobs-message">
            No jobs found. Try clearing filters or a different search.
          </p>
        ) : (
          <>
            <ul className="jobs-list">
              {currentJobs.map((job, idx) => (
                <JobCard
                  key={job.id || idx}
                  job={job}
                  favorites={favorites}
                  onFavoriteToggle={toggleFavorite}
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
