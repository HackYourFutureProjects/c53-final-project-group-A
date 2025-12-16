import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { icons, gif } from "../assets";
import { UseUser } from "../context/UserContext";
import useFetch from "../hooks/useFetch";
import { defaultUser } from "../data/defaultUser.js";

export default function UserMenu() {
  const { user, dispatch, isMeLoading, setMessage } = UseUser();
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading: isLogoutLoading,
    error,
    performFetch,
  } = useFetch("/users/logout", (data) => {
    setMessage(data.msg);
    dispatch({ type: "LOGOUT" });
  });

  useEffect(() => {
    if (error) {
      console.error("Error logging out:", error);
      setMessage(String(error));
    }
  }, [error]);

  return (
    <div className="user-menu">
      <button
        type="button"
        className="user-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <img
          src={user.avatar || defaultUser.avatar}
          alt={user?.name || "User"}
          className="user-avatar"
        />
        <span className="divider"></span>
        <span className="user-name">{user?.firstname}</span>
        {(isMeLoading || isLogoutLoading) && (
          <img src={gif.spinner} className="spinner" />
        )}
        <img
          src={icons.arrow}
          alt=""
          className={`arrow ${isOpen ? "arrow-open" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="user-dropdown" role="menu">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            About
          </NavLink>
          {user.email !== defaultUser.email ? (
            <NavLink
              to="/"
              className="user-item"
              role="menuitem"
              onClick={() => {
                performFetch({ method: "POST", credentials: "include" });
                setIsOpen(false);
              }}
            >
              Logout
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "user-item active" : "user-item"
              }
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}
