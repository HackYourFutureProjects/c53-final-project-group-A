import { createContext, useContext } from "react";
import { UseAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  // Use user and setUser from the Auth context
  const { user, setUser } = UseAuth();

  // Ensure favorites is an array on the user object
  const favorites = Array.isArray(user?.favorites) ? user.favorites : [];

  // Toggle a job id in the favorites array (add if missing, remove if present)
  const toggleFavorite = (jobId) => {
    setUser((prev) => {
      const prevFavorites = Array.isArray(prev?.favorites)
        ? prev.favorites
        : [];
      const exists = prevFavorites.includes(jobId);
      const newFavorites = exists
        ? prevFavorites.filter((id) => id !== jobId)
        : [...prevFavorites, jobId];
      return { ...prev, favorites: newFavorites };
    });
  };

  return (
    <FavoritesContext.Provider value={{ toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const UseFavorites = () => useContext(FavoritesContext);
