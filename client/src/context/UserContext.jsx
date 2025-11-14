import { createContext, useReducer, useState, useContext } from "react";
import { defaultUser } from "../data/defaultUser";

const UserContext = createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "REGISTER":
    case "LOGIN":
      return { ...defaultUser, ...action.payload };
    case "LOGOUT":
      return action.payload || defaultUser;
    case "ADD_SKILL": {
      const newSkill = action.payload;
      const prevSkills = Array.isArray(state?.skills)
        ? state.skills.slice()
        : [];
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
    case "UPDATE_USER": {
      const payload = action.payload || {};
      // Shallow merge; merge nested address specifically
      const next = { ...state, ...payload };
      if (payload.address) {
        next.address = { ...(state.address || {}), ...payload.address };
      }
      return next;
    }
    default:
      return state;
  }
}

function UserContextProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, defaultUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const login = async (email, _password) => {
    void _password;
    setLoading(true);
    clearError();
    try {
      await new Promise((res) => setTimeout(res, 100)); // simulate API call
      //Simulate success or failure
      if (email === defaultUser.email || email === "fail@example.com")
        throw new Error("Invalid credentials");
      dispatch({
        type: "LOGIN",
        payload: { firstName: "userlogged", lastName: "User", email },
      });
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
      if (email === defaultUser.email || email === "yahya@yahoo.com")
        throw new Error("Email already registered");
      dispatch({ type: "REGISTER", payload: { firstName, lastName, email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => dispatch({ type: "LOGOUT", payload: defaultUser });

  const toggleFavorite = (jobId) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: jobId });
  };

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
        toggleFavorite,
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
