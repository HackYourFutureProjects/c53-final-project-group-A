import { createContext, useState, useContext } from "react";
import defaultUser from "../data/defaultUser";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------------------- CLEAR ERROR --------------------
  const clearError = () => setError(null);

  const login = async (email, _password) => {
    void _password;
    setLoading(true);
    clearError();
    try {
      await new Promise((res) => setTimeout(res, 100)); // simulate API call
      //Simulate success or failure
      if (email === "fail@example.com") throw new Error("Invalid credentials");
      setUser((prev) => ({
        ...prev,
        firstName: "userlogged",
        lastName: "User",
        email,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (firstName, lastName, email, _password) => {
    void _password;
    setLoading(true);
    clearError();
    try {
      await new Promise((res) => setTimeout(res, 100));
      if (email === "yahya@yahoo.com")
        throw new Error("Email already registered");
      setUser((prev) => ({ ...prev, firstName, lastName, email }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(defaultUser);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, signup, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
