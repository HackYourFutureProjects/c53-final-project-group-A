// --- New helper function for normalizing names (Fixing Casing) ---
// This function converts fields with lowercase letters (such as firstname)
// coming from the backend into camelCase (such as firstName) used in React.

export const fixUserData = (backendUser) => {
  if (!backendUser) return null;

  return {
    ...backendUser,

    firstName: backendUser.firstname || backendUser.firstName || "",
    lastName: backendUser.lastname || backendUser.lastName || "",

    houseNumber: backendUser.housenumber || backendUser.houseNumber || "",

    favorites: Array.isArray(backendUser.favorites)
      ? backendUser.favorites
      : [],
  };
};
