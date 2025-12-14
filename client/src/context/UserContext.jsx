import {
  createContext,
  useReducer,
  useState,
  useContext,
  useEffect,
} from "react";
import { defaultUser } from "../data/defaultUser";
import { fixUserSkills } from "../util/fixUserSkills";
import useFetch from "../hooks/useFetch";

const UserContext = createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "REGISTER":
    case "LOGIN":
      return { ...defaultUser, ...action.payload };
    case "UPDATE_USER": {
      return { ...state, ...action.payload };
    }
    case "LOGOUT":
      return action.payload || defaultUser;
    case "SET_SKILLS": {
      return { ...state, skills: action.payload };
    }
    case "TOGGLE_FAVORITE": {
      const job = action.payload;
      const jobId = job?.id;
      const prevFavorites = Array.isArray(state?.favorites)
        ? state.favorites
        : [];

      const exists = prevFavorites.some((fav) => fav.id === jobId);
      const newFavorites = exists
        ? prevFavorites.filter((fav) => fav.id !== jobId)
        : [...prevFavorites, job];

      return { ...state, favorites: newFavorites };
    }

    default:
      return state;
  }
}

function UserContextProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, defaultUser);
  const [message, setMessage] = useState(null);

  // -------------------- CLEAR MESSAGE --------------------
  const clearMessage = () => setMessage(null);

  // -------------------- GET CURRENT USER --------------------
  function handleFetchMeResults(data) {
    if (data.user) {
      const normalizedSkills = fixUserSkills(data.user.skills);
      const favoriteJobs = Array.isArray(data.user.favorites)
        ? data.user.favorites.map((job) => ({
            id: job.id,
            title: job.title,
            organization: job.organization,
            organization_url: job.organization_url,
            employment_type: job.employment_type,
            url: job.url,
            organization_logo: job.organization_logo,
            display_location: job.display_location,
            work_mode: job.work_mode,
            seniority: job.seniority,
            description_text: job.description_text,
            date_posted: job.date_posted,
            travel_time: job.travel_time,
            least_transfers: job.least_transfers,
            normalized_description: job.normalized_description,
          }))
        : [];

      dispatch({
        type: "LOGIN",
        payload: {
          ...data.user,
          skills: normalizedSkills,
          favorites: favoriteJobs,
        },
      });
    } else {
      dispatch({ type: "LOGOUT", payload: defaultUser });
    }
    clearMessage();
  }

  const {
    isLoading: isMeLoading,
    error: fetchMeError,
    performFetch: performFetchMe,
  } = useFetch("/users/me", handleFetchMeResults);

  useEffect(() => {
    performFetchMe({ credentials: "include" });
  }, []);

  useEffect(() => {
    if (!fetchMeError) return;

    // "No token provided" is expected when browsing as a guest, so avoid noisy logs.
    if (fetchMeError !== "No token provided") {
      console.error("Error fetching current user:", fetchMeError);
    }

    dispatch({ type: "LOGOUT", payload: defaultUser });
  }, [fetchMeError]);
  // -------------------- UPDATE PROFILE --------------------
  function handleUpdateProfileResults(data) {
    const normalizedSkills = fixUserSkills(data.user.skills);
    dispatch({
      type: "UPDATE_USER",
      payload: {
        ...data.user,
        skills: normalizedSkills,
      },
    });
    setMessage("Profile updated successfully!");
  }

  const {
    isLoading: isUpdateProfileLoading,
    error: updateProfileError,
    performFetch: performUpdateProfile,
  } = useFetch("/users/profile", handleUpdateProfileResults);

  async function updateProfile(updatedFields) {
    performUpdateProfile({
      method: "PUT",
      body: JSON.stringify(updatedFields),
      credentials: "include",
    });
  }
  // -------------------- DELETE USER --------------------
  function handleDeleteUserResults(data) {
    setMessage(data.msg || "Account deleted successfully!");
  }

  const {
    isLoading: isDeleteUserLoading,
    error: deleteUserError,
    performFetch: performDeleteUser,
  } = useFetch("/users/delete/${user.id}", handleDeleteUserResults);

  async function deleteUser() {
    performDeleteUser({ method: "DELETE", credentials: "include" });
  }
  // -------------------- CHANGE PASSWORD --------------------
  function handleChangePasswordResults(data) {
    setMessage(data.msg || "Password changed successfully!");
  }

  const {
    isLoading: isChangePasswordLoading,
    error: changePasswordError,
    performFetch: performChangePassword,
  } = useFetch("/users/change-password", handleChangePasswordResults);

  async function changePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required.");
    }

    performChangePassword({
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
      credentials: "include",
    });
  }
  // -------------------- FAVORITES --------------------
  function handleToggleFavoriteResults(data) {
    setMessage(
      data.action === "added"
        ? "Job added to favorites!"
        : "Job removed from favorites!",
    );
  }

  const {
    isLoading: isToggleFavoriteLoading,
    error: toggleFavoriteError,
    performFetch: performToggleFavorite,
  } = useFetch("/users/favorites/toggle", handleToggleFavoriteResults);

  async function toggleFavorite(job) {
    dispatch({ type: "TOGGLE_FAVORITE", payload: job });
    performToggleFavorite({
      method: "POST",
      body: JSON.stringify({ job }),
      credentials: "include",
    });
  }

  // Combined loading and error states
  const loading =
    isMeLoading ||
    isUpdateProfileLoading ||
    isDeleteUserLoading ||
    isChangePasswordLoading ||
    isToggleFavoriteLoading;

  const error =
    updateProfileError ||
    deleteUserError ||
    changePasswordError ||
    toggleFavoriteError;

  return (
    <UserContext.Provider
      value={{
        user,
        dispatch,
        loading,
        error,
        // clearError,
        message,
        setMessage,
        clearMessage,
        updateProfile,
        toggleFavorite,
        deleteUser,
        changePassword,
        // Expose individual loading states
        isMeLoading,
        isUpdateProfileLoading,
        isDeleteUserLoading,
        isChangePasswordLoading,
        isToggleFavoriteLoading,
        // Expose individual error states
        updateProfileError,
        deleteUserError,
        changePasswordError,
        toggleFavoriteError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

function UseUser() {
  return useContext(UserContext);
}

export { UserContextProvider, UseUser };
