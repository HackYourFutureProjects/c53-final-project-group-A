function normalizeDescription(str) {
  const s = typeof str === "string" ? str : "";
  return " " + s.replace(/[^A-Za-z0-9+#]/g, " ").replace(/ +/g, " ") + " ";
}

export default function processJobPost(job) {
  const {
    id,
    url,
    title,
    date_posted,
    employment_type = [],
    remote_derived = false,
    locations_derived = [],
    seniority,
    description_text = "",
    organization,
    organization_url,
    organization_logo,
  } = job || {};
  // normalize seniority values coming from the job source
  let normalizedSeniority;
  switch (seniority) {
    case "Stagiair":
      normalizedSeniority = "Internship";
      break;
    case "Instapniveau":
      normalizedSeniority = "Entry level";
      break;
    case "Medewerker":
      normalizedSeniority = "Associate";
      break;
    case "Senior medewerker":
      normalizedSeniority = "Mid-Senior level";
      break;
    case "Directeur":
      normalizedSeniority = "Director";
      break;
    case "Bestuurder":
      normalizedSeniority = "Executive";
      break;
    case "Niet van toepassing":
      normalizedSeniority = "Not applicable";
      break;
    default:
      normalizedSeniority = seniority;
  }
  return {
    id,
    url,
    title,
    date_posted,
    employment_type:
      Array.isArray(employment_type) && employment_type.length > 0
        ? employment_type[0].replace("_", " ")
        : null,
    work_mode: remote_derived === true ? "Remote" : "On-site",
    display_location:
      Array.isArray(locations_derived) && locations_derived.length > 0
        ? locations_derived[0]
        : null,
    seniority: normalizedSeniority,
    description_text,
    normalized_description:
      normalizeDescription(title) + normalizeDescription(description_text),
    travel_time: null,
    least_transfers: null,
    organization,
    organization_url,
    organization_logo,
  };
}
