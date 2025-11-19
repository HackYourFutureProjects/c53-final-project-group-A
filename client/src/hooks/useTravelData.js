import { useState } from "react";

export default function useTravelData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateBatchTravel = async (homeAddress, workCities) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/travel/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeAddress, workCities }),
      });
      if (!response.ok) throw new Error("Failed to fetch travel info");
      const data = await response.json();
      setIsLoading(false);
      return data.result;
    } catch (e) {
      setError(e.message);
      setIsLoading(false);
      throw e;
    }
  };

  return { calculateBatchTravel, isLoading, error };
}
