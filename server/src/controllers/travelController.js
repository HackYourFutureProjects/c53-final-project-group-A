import { logError } from "../util/logging.js";
import { getTransitRouteSummary } from "../services/googleMapsApi.js";

function formatAddress(address) {
  let parts = [];
  if (address?.street) parts.push(address.street);
  if (address?.housenumber) parts.push(address.housenumber);
  if (address?.city) parts.push(address.city);
  parts = [parts.join(" ")];
  if (address?.country) parts.push(address.country);
  return parts.join(", ");
}

export async function calculateTravelTime(req, res) {
  try {
    const { homeAddress, workCity } = req.body;

    if (!homeAddress || !workCity) {
      return res.status(400).json({
        success: false,
        msg: "Home address and work city are required",
      });
    }

    const travelData = await getTransitRouteSummary({
      origin: homeAddress,
      destination: workCity,
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
    });

    return res.status(200).json({
      success: true,
      result: {
        homeAddress,
        workCity,
        travel_time: Math.round(travelData.travel_time),
        least_transfers: travelData.least_transfers,
      },
    });
  } catch (error) {
    logError("Travel calculation error:", error);
    return res.status(500).json({
      success: false,
      msg: "Error calculating travel time",
      error: error.message,
    });
  }
}

export default async function calculateBatchTravelTime(req, res) {
  try {
    const { homeAddress, workCities } = req.body;
    const {
      // homeStreet, homeHousenumber,
      homeCity,
      // homeCountry
    } = homeAddress;
    const formattedHomeAddress = formatAddress(homeAddress);
    console.log(homeAddress);

    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escapeRegExp(homeCity), "i");

    // Build an array of promises for parallel execution. For same-city matches
    // we return an already-resolved promise with zero travel time.
    const promises = workCities.map((workCity) => {
      console.log(workCity);

      if (re.test(workCity)) {
        return Promise.resolve({
          workCity,
          travel_time: 0,
          least_transfers: 0,
          success: true,
        });
      }

      return getTransitRouteSummary({
        origin: formattedHomeAddress,
        destination: workCity,
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      })
        .then((travelData) => ({
          workCity,
          travel_time: Math.round(travelData.travel_time),
          least_transfers: travelData.least_transfers,
          success: true,
        }))
        .catch((error) => ({
          workCity,
          success: false,
          error: error.message,
        }));
    });

    // Await all promises in parallel. Using Promise.all is fine because each
    // individual promise handles its own errors and resolves with a result
    // object; Promise.allSettled could be used too but isn't necessary here.
    const results = await Promise.all(promises);
    console.log("results", results);
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
