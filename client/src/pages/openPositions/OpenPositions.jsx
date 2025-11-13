import { useMemo, useState } from "react";

import DropdownFilter from "../../components/DropdownFilter/DropdownFilter";
import JobCard from "../../components/JobCard/JobCard";
import Pagination from "../../components/Pagination/Pagination";

// WE TEMPORARY UNLINKED FILE sortAndFilterJobs FROM THE OpenPositions FOR DEBUGGING
// PLEASE UNCOMMENT NEXT 1 LINE AFTER IMPLEMENTING SORTING AND FILTERING
// import { sortAndFilterJobs } from "../../util/sortingAndFiltering";

import { UseJobs } from "../../context/JobsContext";
import { UseFavorites } from "../../context/FavoritesContext";
import "./OpenPositions.css";
import SkillsSettings from "../../components/SkillsSettings";

//preprocessing
const preprocessJobs = (jobs) => {
  return jobs.map((job) => {
    // handle workMode logic - checking all the edge cases
    let workMode = "On-site"; //default - covers all falsy values
    if (job.remote_derived === true || job.remote_derived === "Remote") {
      workMode = "Remote";
    } else if (job.remote_derived === "Hybrid") {
      workMode = "Hybrid";
    }

    // handle location logic
    const displayLocation =
      job.locations_derived && job.locations_derived.length > 0
        ? job.locations_derived[0]
        : null;

    return {
      ...job,
      workMode,
      displayLocation,
    };
  });
};

export default function OpenPositions() {
  // PLEASE REMOVE NEXT 1 LINE AFTER IMPLEMENTING SORTING AND FILTERING
  const { allJobs, searchTerm } = UseJobs();

  // PLEASE UNCOMMENT NEXT 1 LINE AFTER IMPLEMENTING SORTING AND FILTERING
  // const { allJobs, searchTerm, showResults } = UseJobs();

  const { favorites, toggleFavorite } = UseFavorites();

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

  //preprocess jobs wit useMemo - avoid recalculating
  const processedJobsWithMemo = useMemo(() => {
    return preprocessJobs(allJobs);
  }, [allJobs]);

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

  // FOR DEBUGGING, PLEASE REMOVE THE NEXT 1 LINE WHEN YOU IMPLEMENT FILTERING AND SORTING
  const filteredJobs = processedJobsWithMemo;

  // PLEASE UNCOMMENT FUNCTION filteredJobs WHEN YOU IMPLEMENT FILTERING AND SORTING, BECAUSE I TEMPORARY UNLINKED sortAndFilterJobs FROM THE OpenPositions FOR DEBUGGING
  // const filteredJobs = useMemo(() => {
  //   // ✅ only compute filtered jobs if showResults is true
  //   if (!showResults || !searchTerm.trim()) return [];
  //   return sortAndFilterJobs(processedJobsWithMemo, activeFilters, sortBy, searchTerm);
  // }, [processedJobsWithMemo, activeFilters, sortBy, searchTerm, showResults]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div className="open-positions content-container">
      <SkillsSettings />
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
                  isFavoritesPage={false}
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
