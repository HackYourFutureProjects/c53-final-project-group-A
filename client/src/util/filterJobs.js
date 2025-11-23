export function findFilterOptions(allJobs) {
  const experienceOptions = [];
  const jobTypeOptions = [];
  const workModeOptions = [];
  for (const job of allJobs) {
    if (job.seniority && !experienceOptions.includes(job.seniority)) {
      experienceOptions.push(job.seniority);
    }
    if (job.employment_type && !jobTypeOptions.includes(job.employment_type)) {
      jobTypeOptions.push(job.employment_type);
    }
    if (job.work_mode && !workModeOptions.includes(job.work_mode)) {
      workModeOptions.push(job.work_mode);
    }
  }
  return {
    experienceOptions,
    jobTypeOptions,
    workModeOptions,
  };
}

export function filterJobs(allJobs, activeFilters) {
  const { seniorityLevel, employmentType, work_mode } = activeFilters;
  let filtered = allJobs.filter((job) => {
    const matchesSeniority =
      seniorityLevel.size === 0 || seniorityLevel.has(job.seniority);
    const matchesJobType =
      employmentType.size === 0 || employmentType.has(job.employment_type);
    const matcheswork_mode =
      work_mode.size === 0 || work_mode.has(job.work_mode);
    return matchesSeniority && matchesJobType && matcheswork_mode;
  });
  return filtered;
}
