export async function getTransitRouteSummary({ origin, destination, apiKey }) {
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
    averageTravelTimeMinutes:
      durations.reduce((a, b) => a + b, 0) / durations.length,
    leastTransfers: Math.min(...transfers),
    routesCount: routes.length,
  };
}
