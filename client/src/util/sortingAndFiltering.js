export function sortAndFilterJobs(
  allJobs,
  activeFilters,
  sortBy,
  searchTerm = "",
) {
  const { seniorityLevel, employmentType, workMode } = activeFilters;
  const searchLower = searchTerm.toLowerCase().trim();

  let filtered = allJobs.filter((job) => {
    const matchesSeniority =
      seniorityLevel.size === 0 || seniorityLevel.has(job.seniorityLevel);
    const matchesJobType =
      employmentType.size === 0 || employmentType.has(job.employmentType);
    const matchesWorkMode = workMode.size === 0 || workMode.has(job.workMode);
    const matchesSearch =
      !searchLower ||
      job.title?.toLowerCase().includes(searchLower) ||
      job.company?.toLowerCase().includes(searchLower) ||
      job.location?.toLowerCase().includes(searchLower);
    return (
      matchesSeniority && matchesJobType && matchesWorkMode && matchesSearch
    );
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
