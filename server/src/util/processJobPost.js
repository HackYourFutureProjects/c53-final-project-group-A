function normalizeDescription(str) {
  return " " + str.replace(/[^A-Za-z0-9+#]/g, " ").replace(/ +/g, " ") + " ";
}

export default function processJobPost(job) {
  const {
    id,
    url,
    title,
    date_posted,
    employment_type,
    remote_derived,
    locations_derived,
    seniority,
    description_text,
    organization,
    organization_url,
    organization_logo,
  } = job;

  return {
    id,
    url,
    title,
    date_posted,
    employment_type,
    work_mode: remote_derived === true ? "Remote" : "On-site",
    display_location:
      locations_derived.length > 0 ? locations_derived[0] : null,
    seniority: seniority === "Niet van toepassing" ? null : seniority,
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
