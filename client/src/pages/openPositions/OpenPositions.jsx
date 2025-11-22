import { useState } from "react";
import DropdownFilter from "../../components/DropdownFilter/DropdownFilter";
import JobCard from "../../components/JobCard/JobCard";
import Pagination from "../../components/Pagination/Pagination";
import { defaultUser, formatAddress } from "../../data/defaultUser";

// WE TEMPORARY UNLINKED FILE sortAndFilterJobs FROM THE OpenPositions FOR DEBUGGING
// PLEASE UNCOMMENT NEXT 1 LINE AFTER IMPLEMENTING SORTING AND FILTERING
// import { sortAndFilterJobs } from "../../util/sortingAndFiltering";

import { UseJobs } from "../../context/JobsContext";
import "./OpenPositions.css";
import SkillsSettings from "../../components/SkillsSettings";
import { useEffect } from "react";
import useTravelData from "../../hooks/useTravelData";

export default function OpenPositions() {
  // PLEASE REMOVE NEXT 1 LINE AFTER IMPLEMENTING SORTING AND FILTERING
  const { allJobs, searchTerm } = UseJobs();

  // PLEASE UNCOMMENT NEXT 1 LINE AFTER IMPLEMENTING SORTING AND FILTERING
  // const { allJobs, searchTerm, showResults } = UseJobs();

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const [activeFilters, setActiveFilters] = useState({
    seniorityLevel: new Set(),
    employmentType: new Set(),
    work_mode: new Set(),
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
  const work_modeOptions = ["On-site", "Hybrid", "Remote"];
  const sortOptions = [
    "Skill match",
    "Newest First",
    "Nearest First",
    "Fewest applicants",
    "Fewest transfers",
  ];

  const [jobsWithTravel, setJobsWithTravel] = useState([]);
  const [homeAddress] = useState(formatAddress(defaultUser.address));
  const { calculateBatchTravel, error: travelError } = useTravelData();

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
      work_mode: new Set(),
    });
    setSortBy("Skill match");
    setCurrentPage(1);
  };

  // FOR DEBUGGING, PLEASE REMOVE THE NEXT 1 LINE WHEN YOU IMPLEMENT FILTERING AND SORTING
  const filteredJobs = allJobs;

  // PLEASE UNCOMMENT FUNCTION filteredJobs WHEN YOU IMPLEMENT FILTERING AND SORTING, BECAUSE I TEMPORARY UNLINKED sortAndFilterJobs FROM THE OpenPositions FOR DEBUGGING
  // const filteredJobs = useMemo(() => {
  //   // ✅ only compute filtered jobs if showResults is true
  //   if (!showResults || !searchTerm.trim()) return [];
  //   return sortAndFilterJobs(processedJobsWithMemo, activeFilters, sortBy, searchTerm);
  // }, [processedJobsWithMemo, activeFilters, sortBy, searchTerm, showResults]);

  //pagination
  const totalPages = Math.ceil(jobsWithTravel.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobsWithTravel.slice(indexOfFirstJob, indexOfLastJob);

  //useEffect for travelInfo
  useEffect(() => {
    async function fetchTravelInfo() {
      if (!filteredJobs.length) {
        setJobsWithTravel([]);
        return;
      }
      const workCities = filteredJobs.map((job) => job.display_location);
      try {
        const travelResult = await calculateBatchTravel(
          homeAddress,
          workCities,
        );
        const jobsWithTravelInfo = filteredJobs.map((job, idx) => ({
          ...job,
          travel_time: travelResult.travelDetails[idx].travel_time,
          least_transfers: travelResult.travelDetails[idx].least_transfers,
        }));
        setJobsWithTravel(jobsWithTravelInfo);
      } catch {
        setJobsWithTravel(filteredJobs);
      }
    }
    fetchTravelInfo();
  }, [filteredJobs, homeAddress]);

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
              options={work_modeOptions}
              filterKey="work_mode"
              activeValues={activeFilters.work_mode}
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

      {travelError && (
        <div className="error-message">
          Error loading commute info: {travelError}
        </div>
      )}

      {jobsWithTravel.length === 0 ? (
        <p className="job-message">
          No jobs are shown. Go to <strong>Job Search</strong> or{" "}
          <strong>Clear Filters</strong> to see more results.
        </p>
      ) : (
        <>
          <p className="job-message">
            Showing {jobsWithTravel.length} jobs in total{" "}
            {searchTerm && `for "${searchTerm}"`}
          </p>
          <ul className="jobs-list">
            {currentJobs.map((job, idx) => (
              <JobCard
                key={job.id || idx}
                job={job}
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
  );
}
