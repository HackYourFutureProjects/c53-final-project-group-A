import { createContext, useState, useContext } from "react";
import { defaultUser } from "../data/defaultUser";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(defaultUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState(null);

  const API_URL = "http://localhost:3000/api/users";

  // -------------------- CLEAR ERROR --------------------
  const clearError = () => setError(null);
  const clearMessage = () => setMessage(null);

  // -------------------- LOGIN --------------------

  const login = async (email, password) => {
    setLoading(true);
    clearError();
    clearMessage();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.msg || `Signup failed with status ${res.status}`,
        );
      }

      const data = await res.json();

      if (!data.success) throw new Error(data.msg || "Login failed");

      // Set the user and token received from the server
      setUser(data.user);
      setToken(data.token);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // -------------------- SIGNUP --------------------

  const signup = async (firstName, lastName, email, password) => {
    setLoading(true);
    clearError();
    clearMessage();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { firstName, lastName, email, password },
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.msg || "Signup failed");

      // Set the user and token received from the server
      setUser(data.user);
      setToken(data.token);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // const logout = () => setUser(defaultUser);

  // -------------------- LOGOUT --------------------
  const logout = async () => {
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
      setUser(defaultUser);
      setToken(null);
      clearError();
    }
  };

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
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
        toggleFavorite,
        token,
        message,
        setMessage,
        clearMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function UseAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, UseAuth };
