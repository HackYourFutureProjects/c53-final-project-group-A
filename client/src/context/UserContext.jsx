import {
  createContext,
  useReducer,
  useState,
  useContext,
  useEffect,
} from "react";
import { defaultUser } from "../data/defaultUser";

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
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState(null);
  const API_URL = "http://localhost:3000/api/users";

  // Initialize token from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("token");
      if (saved) setToken(saved);
    } catch (err) {
      // don't block app if localStorage is unavailable
      console.error("Failed to read token from localStorage", err);
    }
  }, []);

  // Persist token changes to localStorage
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Failed to persist token to localStorage", err);
    }
  }, [token]);

  // -------------------- CLEAR ERROR --------------------
  const clearError = () => setError(null);
  const clearMessage = () => setMessage(null);
  // -------------------- LOGIN --------------------
  async function login(email, password) {
    setLoading(true);
    clearError();
    clearMessage();
    if (email === defaultUser.email) throw new Error("Invalid credentials");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.msg || `Login failed with status ${res.status}`,
        );
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.msg || "Login failed");
      // Set the user and token received from the server
      dispatch({
        type: "LOGIN",
        payload: data.user,
      });
      setToken(data.token);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  // -------------------- SIGNUP --------------------
  async function signup(firstname, lastname, email, password) {
    if (email === defaultUser.email)
      throw new Error("Email already registered");
    setLoading(true);
    clearError();
    clearMessage();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { firstname, lastname, email, password },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.msg || "Signup failed");
      // Set the user and token received from the server
      dispatch({ type: "REGISTER", payload: data.user });
      setToken(data.token);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  // -------------------- LOGOUT --------------------
  async function logout() {
    try {
      if (token) {
        // Attempt to log out on the server side
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setMessage("Logged out successfully!");
    } catch (err) {
      console.error("Error logging out:", err);
      // We clear the user and token state even if the server request fails
      setMessage("Failed to log out from server, but local state cleared.");
    } finally {
      dispatch({ type: "LOGOUT", payload: defaultUser });
      setToken(null);
      clearError();
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
        token,
        message,
        setMessage,
        clearMessage,
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
