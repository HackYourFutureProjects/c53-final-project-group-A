import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../../.env") });

export async function getTransitRouteSummary({ origin, destination, apiKey }) {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY is not defined in environment variables. Please check your .env file.",
    );
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    origin,
  )}&destination=${encodeURIComponent(destination)}&mode=transit&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch from Google Maps API");
  const data = await response.json();

  const routes = data.routes;
  if (!routes || routes.length === 0) throw new Error("No routes found");
  const durations = routes.map((r) => r.legs[0].duration.value / 60);
  const transfers = routes.map(
    (r) =>
      r.legs[0].steps.filter((s) => s.travel_mode === "TRANSIT").length - 1,
  );

  return {
    travel_time: durations.reduce((a, b) => a + b, 0) / durations.length,
    least_transfers: Math.min(...transfers),
    routesCount: routes.length,
  };
}
