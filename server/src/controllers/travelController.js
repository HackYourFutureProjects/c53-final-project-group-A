import { logError } from "../util/logging.js";
import { getTransitRouteSummary } from "../services/googleMapsApi.js";

function formatAddress(address) {
  let parts = [];
  if (address?.homeStreet) parts.push(address.homeStreet);
  if (address?.homeHousenumber) parts.push(address.homeHousenumber);
  if (address?.homeCity) parts.push(address.homeCity);
  parts = [parts.join(" ")];
  if (address?.homeCountry) parts.push(address.homeCountry);
  return parts.join(", ");
}

// export async function calculateTravelTime(req, res) {
//   try {
//     const { homeAddress, workCity } = req.body;

//     if (!homeAddress || !workCity) {
//       return res.status(400).json({
//         success: false,
//         msg: "Home address and work city are required",
//       });
//     }

//     const travelData = await getTransitRouteSummary(
//       homeAddress,
//       workCity,
//       process.env.GOOGLE_MAPS_API_KEY,
//     );

//     return res.status(200).json({
//       success: true,
//       result: {
//         homeAddress,
//         workCity,
//         travel_time: Math.round(travelData.travel_time),
//         least_transfers: travelData.least_transfers,
//       },
//     });
//   } catch (error) {
//     logError("Travel calculation error:", error);
//     return res.status(500).json({
//       success: false,
//       msg: "Error calculating travel time",
//       error: error.message,
//     });
//   }
// }

export default async function calculateBatchTravelTime(req, res) {
  try {
    const { homeAddress, workCities } = req.body;
    const { homeStreet, homeHousenumber, homeCity, homeCountry } = homeAddress;
    const formattedHomeAddress = formatAddress(homeAddress);
    console.log("homeAddress", homeAddress);

    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escapeRegExp(homeCity), "i");

    // Build an array of promises. For same-city matches we return an
    // already-resolved promise with zero travel time. For external cities
    // schedule calls to `getTransitRouteSummary` such that each call starts
    // 200ms after the previous one (first starts immediately).
    let apiCallIndex = 0;
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

      const delayMs = apiCallIndex * 1000;
      apiCallIndex += 1;

      return new Promise((resolve) => {
        setTimeout(() => {
          getTransitRouteSummary(
            formattedHomeAddress,
            workCity,
            process.env.GOOGLE_MAPS_API_KEY,
          )
            .then((travelData) =>
              resolve({
                workCity,
                travel_time: Math.round(travelData.travel_time),
                least_transfers: travelData.least_transfers,
                success: true,
              }),
            )
            .catch((error) =>
              resolve({
                workCity,
                success: false,
                error: error.message,
              }),
            );
        }, delayMs);
      });
    });

    // Await all promises in parallel. Using Promise.all is fine because each
    // individual promise handles its own errors and resolves with a result
    // object; Promise.allSettled could be used too but isn't necessary here.
    const results = await Promise.all(promises);
    console.log("results", results);
    console.log("formattedAddress", formattedHomeAddress);
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
