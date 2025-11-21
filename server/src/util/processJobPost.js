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

  const work_mode = remote_derived === true ? "Remote" : "On-site";
  const display_location =
    locations_derived.length > 0 ? locations_derived[0] : null;
  const normalized_description =
    normalizeDescription(title) + normalizeDescription(description_text);
  const travel_time = "";
  const least_transfers = "";

  return {
    id,
    url,
    title,
    date_posted,
    employment_type,
    work_mode,
    display_location,
    seniority,
    description_text,
    normalized_description,
    travel_time,
    least_transfers,
    organization,
    organization_url,
    organization_logo,
  };
}
