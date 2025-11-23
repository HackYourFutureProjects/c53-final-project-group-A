export function findFilterOptions(allJobs) {
  const experienceSet = new Set();
  const jobTypeSet = new Set();
  const workModeSet = new Set();
  for (const job of allJobs) {
    if (job.seniority) {
      experienceSet.add(job.seniority);
    }
    if (job.employment_type) {
      jobTypeSet.add(job.employment_type);
    }
    if (job.work_mode) {
      workModeSet.add(job.work_mode);
    }
  }
  return {
    experienceOptions: Array.from(experienceSet),
    jobTypeOptions: Array.from(jobTypeSet),
    workModeOptions: Array.from(workModeSet),
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
