import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, _password) => {
    void _password;
    setLoading(true);
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 100)); // simulate API call
      //Simulate success or failure
      if (email === "fail@example.com") throw new Error("Invalid credentials");
      setUser({ name: "Yahya User", email });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (firstName, lastName, email, _password) => {
    void _password;
    setLoading(true);
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 100));
      if (email === "yahya@yahoo.com")
        throw new Error("Email already registered");
      setUser({ firstName, lastName, email });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
