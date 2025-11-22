// synonyms seniority (EN + NL)
const senioritySynonyms = {
  "entry level": [
    "entry level",
    "entry-level",
    "junior",
    "instapniveau",
    "starter",
  ],
  associate: ["associate", "medewerker"],
  "mid-senior level": [
    "mid-senior",
    "mid senior",
    "medior",
    "senior",
    "ervaren",
  ],
  internship: ["internship", "intern", "stage", "stagiair"],
  director: ["director", "directeur", "hoofd"],
  executive: ["executive", "bestuurder", "c-level"],
  "not applicable": ["not applicable", "niet van toepassing", "n/a", "na"],
};

function normalizeEmploymentType(employmentType) {
  if (!employmentType) return "UNKNOWN";

  const type = Array.isArray(employmentType)
    ? employmentType[0]
    : employmentType;

  return type.toString().toUpperCase().replace(/[\s-]/g, "_").trim();
}

//check seniority with synonyms
function checkSeniority(jobSeniority, activeFilters) {
  if (activeFilters.size === 0) return true;

  const lowerJobSeniority = (jobSeniority || "").toLowerCase();

  for (const filter of activeFilters) {
    const synonymKey = filter.replace(/_/g, " ").toLowerCase();
    const synonyms = senioritySynonyms[synonymKey] || [synonymKey];

    if (synonyms.some((synonym) => lowerJobSeniority.includes(synonym))) {
      return true;
    }
  }

  return false;
}

// work mode
function derivework_mode(job) {
  if (job.remote_derived === true) return "REMOTE";

  if (job.location_type) {
    const locType = job.location_type.toLowerCase();
    if (locType.includes("remote")) return "REMOTE";
    if (locType.includes("hybrid")) return "HYBRID";
    if (locType.includes("on-site") || locType.includes("onsite"))
      return "ON_SITE";
  }

  // if there is no specific address, we consider remote
  if (job.locations_raw && job.locations_raw.length > 0) {
    const location = job.locations_raw[0];
    if (
      !location.address?.addressLocality &&
      !location.address?.streetAddress
    ) {
      return "REMOTE";
    }
  }
  return job.locations_derived?.length > 0 ? "ON_SITE" : "REMOTE";
}

export function sortAndFilterJobs(
  allJobs,
  activeFilters,
  sortBy,
  searchTerm = "",
) {
  const { seniorityLevel, employmentType, work_mode } = activeFilters;
  const searchLower = searchTerm.toLowerCase().trim();

  let filtered = allJobs.filter((job) => {
    // seniority check
    const matchesSeniority = checkSeniority(job.seniority, seniorityLevel);

    //job type check
    const normalizedJobType = normalizeEmploymentType(job.employment_type);
    const matchesJobType =
      employmentType.size === 0 || employmentType.has(normalizedJobType);

    //work mode check
    const derivedMode = derivework_mode(job);
    // const jobwork_mode = job.remote_derived ? "Remote" : "On-site";
    const matcheswork_mode = work_mode.size === 0 || work_mode.has(derivedMode);

    //search term check
    const jobLocation = job.locations_derived?.[0] || "";
    const jobTitle = job.title || "";
    const jobOrg = job.organization || "";
    const jobDesc = job.linkedin_org_description || "";

    const matchesSearch =
      !searchLower ||
      jobTitle.toLowerCase().includes(searchLower) ||
      jobOrg.toLowerCase().includes(searchLower) ||
      jobLocation.toLowerCase().includes(searchLower) ||
      jobDesc.toLowerCase().includes(searchLower);

    return (
      matchesSeniority && matchesJobType && matcheswork_mode && matchesSearch
    );
  });

  //sorting
  let sorted = [...filtered];
  sorted.sort((a, b) => {
    switch (sortBy) {
      case "Newest First":
        return b.date_posted.localeCompare(a.date_posted);

      // JUST FOR SOME CASE - OTHER APPROACH FOR DATE SORTING
      // (
      //   (new Date(b.datePosted).getTime() || 0) -
      //   (new Date(a.datePosted).getTime() || 0)
      // );

      case "Skill match":
        return (
          (parseFloat(b.skillMatch) || 0) - (parseFloat(a.skillMatch) || 0)
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
