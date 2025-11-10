import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  // Favorites for the default user (no authentication yet)
  const [favorites, setFavorites] = useState({});

  // Toggle a job as favorite or remove it
  const toggleFavorite = (jobId) => {
    setFavorites((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const UseFavorites = () => useContext(FavoritesContext);
