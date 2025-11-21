import {
  createContext,
  useReducer,
  useState,
  useContext,
  useEffect,
} from "react";
import { defaultUser } from "../data/defaultUser";
import { regexEndNormalizeSkill } from "../util/regexEndNormalizeSkill";

const UserContext = createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "REGISTER":
    case "LOGIN":
      return { ...defaultUser, ...action.payload };
    case "UPDATE_USER": {
      const payload = action.payload || {};
      const next = { ...state, ...payload };
      return next;
    }

    case "LOGOUT":
      return action.payload || defaultUser;
    case "ADD_SKILL": {
      const newSkill = action.payload;
      const prevSkills = Array.isArray(state?.skills) ? state.skills : [];
      const combined = [...prevSkills, newSkill].sort((a, b) =>
        String(a?.normalizedSkill ?? "").localeCompare(
          String(b?.normalizedSkill ?? ""),
        ),
      );
      return { ...state, skills: combined };
    }
    case "REMOVE_SKILL": {
      const skill = action.payload;
      const filtered = (state.skills || []).filter(
        (s) => s.skill !== skill.skill,
      );
      return { ...state, skills: filtered };
    }
    case "REMOVE_ALL_SKILLS": {
      // Remove all skills from the user while preserving other fields
      return { ...state, skills: [] };
    }
    case "TOGGLE_FAVORITE": {
      const jobId = action.payload;
      const prevFavorites = Array.isArray(state?.favorites)
        ? state.favorites
        : [];

      const exists = prevFavorites.includes(jobId);
      const newFavorites = exists
        ? prevFavorites.filter((id) => id !== jobId)
        : [...prevFavorites, jobId];
      return { ...state, favorites: newFavorites };
    }

    default:
      return state;
  }
}

function UserContextProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, defaultUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const API_URL = "/users";

  // -------------------- CLEAR ERROR --------------------
  const clearError = () => setError(null);
  const clearMessage = () => setMessage(null);

  async function authFetch(route, options = {}) {
    setLoading(true);
    clearError();
    clearMessage();

    const url = `/api${API_URL}${route}`;

    const baseOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };

    try {
      const res = await fetch(url, { ...baseOptions, ...options });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text || "{}");
      } catch {
        throw new Error("Server returned invalid JSON or is down");
      }

      if (!res.ok) {
        throw new Error(
          data.msg || `Server responded with status ${res.status} for ${url}`,
        );
      }

      if (!data.success) {
        throw new Error(data.msg || "Operation failed due to API policy.");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // -------------------- GET CURRENT USER --------------------

  async function getCurrentUser() {
    try {
      const data = await authFetch("/me", { method: "GET" });

      if (data.user) {
        //  FIX SKILLS HERE
        const skills = Array.isArray(data.user.skills) ? data.user.skills : [];

        const normalizedSkills = skills
          .map((skill) => regexEndNormalizeSkill(skill))
          .sort((a, b) => a.normalizedSkill.localeCompare(b.normalizedSkill));

        //  SEND THE FIXED USER TO THE STATE
        dispatch({
          type: "LOGIN",
          payload: { ...data.user, skills: normalizedSkills },
        });
      } else {
        dispatch({ type: "LOGOUT", payload: defaultUser });
      }

      clearMessage();
    } catch (err) {
      if (
        err.message.includes("token") ||
        err.message.includes("Token") ||
        err.message.includes("not provided")
      ) {
        dispatch({ type: "LOGOUT", payload: defaultUser });
        clearError(); // removes red error message on reload
        return;
      }

      console.error("Error fetching current user:", err);
      dispatch({ type: "LOGOUT", payload: defaultUser });
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  // -------------------- LOGIN --------------------
  async function login(email, password) {
    if (email === defaultUser.email) throw new Error("Invalid credentials");
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await authFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const skills = Array.isArray(data.user.skills) ? data.user.skills : [];

      const normalizedSkills = skills
        .map((skill) => regexEndNormalizeSkill(skill))
        .sort((a, b) => a.normalizedSkill.localeCompare(b.normalizedSkill));

      dispatch({
        type: "LOGIN",
        payload: { ...data.user, skills: normalizedSkills },
      });
      return data.user;
    } catch (err) {
      throw err;
    }
  }
  // -------------------- SIGNUP --------------------
  async function signup(firstname, lastname, email, password) {
    if (email === defaultUser.email)
      throw new Error("Email already registered");
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await authFetch("", {
        method: "POST",
        body: JSON.stringify({
          user: { firstname, lastname, email, password },
        }),
      });
      // Set the user and token received from the server
      dispatch({ type: "REGISTER", payload: data.user });
      return data.user;
    } catch (err) {
      throw err;
    }
  }
  // -------------------- LOGOUT --------------------
  async function logout() {
    try {
      // Attempt to log out on the server side
      await authFetch("/logout", {
        method: "POST",
      });
      setMessage("Logged out successfully!");
    } catch (err) {
      console.error("Error logging out:", err);
      // We clear the user and token state even if the server request fails
      setMessage("Failed to log out from server, but local state cleared.");
    } finally {
      dispatch({ type: "LOGOUT", payload: defaultUser });
      clearError();
    }
  }
  async function updateProfile(updatedFields) {
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await authFetch("/profile", {
        // matches backend route
        method: "PUT",
        body: JSON.stringify(updatedFields),
      });
      dispatch({ type: "UPDATE_USER", payload: data.user });
      setMessage("Profile updated successfully!");
      return data.user;
    } catch (err) {
      throw err;
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        dispatch,
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
        message,
        setMessage,
        clearMessage,
        getCurrentUser,
        updateProfile,
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
