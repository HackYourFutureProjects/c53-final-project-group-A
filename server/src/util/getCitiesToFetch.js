export function getCitiesToFetch(jobsArray, travelDetails) {
  const uniqueCities = [
    ...new Set(
      jobsArray
        .map((job) => {
          const workCity =
            job.cities_derived?.[0] || job.locations_derived?.[0];
          return typeof workCity === "string" && workCity.trim() !== ""
            ? workCity
            : null;
        })
        .filter(Boolean),
    ),
  ];

  return uniqueCities.filter(
    (city) => !Object.prototype.hasOwnProperty.call(travelDetails, city),
  );
}
