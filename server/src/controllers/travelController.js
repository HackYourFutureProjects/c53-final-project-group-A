import { logError } from "../util/logging.js";
import { getTransitRouteSummary } from "../services/googleMapsApi.js";

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
        leastTransfers: travelData.leastTransfers,
        routesCount: travelData.routesCount,
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

    if (!homeAddress || !Array.isArray(workCities) || workCities.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "homeAddress and workCities array are required",
      });
    }

    const results = [];

    for (const workCity of workCities) {
      if (
        homeAddress.toLowerCase().includes(workCity.toLowerCase()) ||
        workCity.toLowerCase().includes(homeAddress.toLowerCase())
      ) {
        results.push({
          workCity,
          travel_time: 0,
          leastTransfers: 0,
          success: true,
        });
        continue;
      }
      try {
        const travelData = await getTransitRouteSummary({
          origin: homeAddress,
          destination: workCity,
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        });

        results.push({
          workCity,
          travel_time: Math.round(travelData.travel_time),
          leastTransfers: travelData.leastTransfers,
          routesCount: travelData.routesCount,
          success: true,
        });
      } catch (error) {
        results.push({
          workCity,
          success: false,
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      result: {
        homeAddress,
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
