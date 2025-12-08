import { logError } from "../util/logging.js";
import { getTransitRouteSummary } from "../services/googleMapsApi.js";

function formatAddress(address) {
  const streetParts = [];
  if (address?.homeStreet) streetParts.push(address.homeStreet);
  if (address?.homeHousenumber) streetParts.push(address.homeHousenumber);
  if (address?.homeCity) streetParts.push(address.homeCity);

  const addressParts = [streetParts.join(" ")];
  if (address?.homeCountry) addressParts.push(address.homeCountry);
  return addressParts.join(", ");
}

export default async function calculateBatchTravelTime(req, res) {
  try {
    const { homeAddress, workCities } = req.body;
    const { homeCity } = homeAddress;
    const formattedHomeAddress = formatAddress(homeAddress);

    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escapeRegExp(" " + homeCity + " "), "i");

    // Build an array of promises. For same-city matches we return an
    // already-resolved promise with zero travel time. For external cities
    // start all `getTransitRouteSummary` calls immediately (concurrent).
    const workPlacesSet = new Set([
      "Netherlands",
      "Drenthe, Netherlands",
      "Flevoland, Netherlands",
      "Friesland, Netherlands",
      "Gelderland, Netherlands",
      "Groningen, Netherlands",
      "Limburg, Netherlands",
      "Noord-Brabant, Netherlands",
      "Noord-Holland, Netherlands",
      "Overijssel, Netherlands",
      "Utrecht, Netherlands",
      "Zeeland, Netherlands",
      "Zuid-Holland, Netherlands",
    ]);
    const promises = workCities.map((workCity) => {
      if (
        re.test(" " + workCity.replace(",", " ") + " ") ||
        workPlacesSet.has(workCity)
      ) {
        return Promise.resolve({
          workCity,
          travel_time: 0,
          least_transfers: 0,
        });
      }
      return getTransitRouteSummary(
        formattedHomeAddress,
        workCity,
        process.env.GOOGLE_MAPS_API_KEY,
      )
        .then((travelData) => {
          return {
            workCity,
            travel_time: Math.round(travelData.travel_time),
            least_transfers: travelData.least_transfers,
          };
        })
        .catch((error) => ({
          workCity,
          error: error.message,
        }));
    });

    const results = await Promise.all(promises);
    return res.status(200).json({
      success: true,
      result: {
        homeAddress: formattedHomeAddress,
        travelDetails: results,
      },
    });
  } catch (error) {
    logError("Batch travel calculation error:", error);
    return res.status(500).json({
      success: false,
      msg: "Error calculating travel times",
      error: error.message,
    });
  }
}
