import { useState, useMemo, useEffect } from "react";

import "./OpenPositions.css";

import { defaultUser, formatAddress } from "../../data/defaultUser";
import { UseJobs } from "../../context/JobsContext";
import { UseUser } from "../../context/UserContext";
import { findFilterOptions, filterJobs } from "../../util/filterJobs";
import useTravelData from "../../hooks/useTravelData";
import getSkillsInDescription from "../../util/getSkillsInDescription";

import DropdownFilter from "../../components/DropdownFilter/DropdownFilter";
import DropdownSort from "../../components/DropdownSort/DropdownSort";
import Pagination from "../../components/Pagination/Pagination";
import JobCard from "../../components/JobCard/JobCard";
import SkillsSettings from "../../components/SkillsSettings";

export default function OpenPositions() {
  const { allJobs, searchTerm } = UseJobs();
  const { user } = UseUser();
  const skills = user?.skills || [];
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const [activeFilters, setActiveFilters] = useState({
    seniorityLevel: new Set(),
    employmentType: new Set(),
    work_mode: new Set(),
  });
    const [selectedSort, setSelectedSort] = useState([
    "Most skill matches",
    "Fewest transport transfers",
    "Nearest first",
    "Newest first",
  ]);
    console.log("OpenPositions: selectedSort (parent state)", selectedSort);
  const [jobsWithTravel, setJobsWithTravel] = useState([]);
  const [homeAddress] = useState(formatAddress(defaultUser.address));
  const { calculateBatchTravel, error: travelError } = useTravelData();

  const jobsWithSkills = useMemo(() => {
    return jobsWithTravel.map((job) => {
      const skillsInDescription = getSkillsInDescription(
        job.normalized_description || "",
        skills,
      );
      return {
        ...job,
        skillsInDescription,
        skillsMatch: skillsInDescription.length,
      };
    });
  }, [jobsWithTravel, skills]);

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
  const totalPages = Math.ceil(jobsWithSkills.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobsWithSkills.slice(indexOfFirstJob, indexOfLastJob);

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
              filterkey="Experience level"
              options={filterOptions.experienceOptions}
              activeValues={activeFilters.seniorityLevel}
              onFilterChange={handleFilterChange}
            />
            <DropdownFilter
              filterkey="Job type"
              options={filterOptions.jobTypeOptions}
              activeValues={activeFilters.employmentType}
              onFilterChange={handleFilterChange}
            />
            <DropdownFilter
              filterkey="Work mode"
              options={filterOptions.workModeOptions}
              activeValues={activeFilters.work_mode}
              onFilterChange={handleFilterChange}
            />
            <DropdownSort selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
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

      {allJobs.length === 0 ? (
        <p className="job-message">
          No jobs are shown. Go to <strong>Job Search</strong> or{" "}
          <strong>Clear Filters</strong> to see more results.
        </p>
      ) : (
        <>
          <p className="job-message">
            Found {allJobs.length} jobs in total for {searchTerm}.
            {!Object.values(activeFilters).every(
              (filterSet) => filterSet.size === 0,
            ) && ` Filtered ${filteredJobs.length} jobs`}
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
