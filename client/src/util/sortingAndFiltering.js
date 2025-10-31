export function sortAndFilterJobs(allJobs, activeFilters, sortBy) {
  const { seniorityLevel, employmentType, workMode } = activeFilters;

  let filtered = allJobs.filter((job) => {
    const matchesSeniority =
      seniorityLevel.size === 0 || seniorityLevel.has(job.seniorityLevel);
    const matchesJobType =
      employmentType.size === 0 || employmentType.has(job.employmentType);
    const matchesWorkMode = workMode.size === 0 || workMode.has(job.workMode);
    return matchesSeniority && matchesJobType && matchesWorkMode;
  });

  let sorted = [...filtered];
  sorted.sort((a, b) => {
    switch (sortBy) {
      case "Skill match":
        return (
          (parseFloat(b.skillMatch) || 0) - (parseFloat(a.skillMatch) || 0)
        );
      case "Newest First":
        return (
          (new Date(b.datePosted).getTime() || 0) -
          (new Date(a.datePosted).getTime() || 0)
        );
      case "Fewest applicants":
        return (
          (a.applicantsCount || Infinity) - (b.applicantsCount || Infinity)
        );
      case "Nearest First":
        return (a.distance || Infinity) - (b.distance || Infinity);
      case "Fewest transfers":
        return (a.transfersCount || Infinity) - (b.transfersCount || Infinity);
      default:
        return 0;
    }
  });

  return sorted;
}
