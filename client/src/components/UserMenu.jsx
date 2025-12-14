import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { icons, gif } from "../assets";
import { UseUser } from "../context/UserContext";
import { defaultUser } from "../data/defaultUser.js";

export default function UserMenu() {
  const { user, logout, isMeLoading } = UseUser();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  const toggle = () => setOpen((v) => !v);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className="user-trigger"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <img
          src={user.avatar || defaultUser.avatar}
          alt={user?.name || "User"}
          className="user-avatar"
        />
        <span className="divider"></span>
        <span className="user-name">{user?.firstname}</span>
        {isMeLoading && <img src={gif.spinner} className="spinner" />}
        <img
          src={icons.arrow}
          alt=""
          className={`arrow ${open ? "arrow-open" : ""}`}
        />
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Profile
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            About
          </NavLink>
          {user.email !== defaultUser.email ? (
            <NavLink
              to="/"
              className="user-item"
              role="menuitem"
              onClick={() => {
                handleLogout();
                setOpen(false);
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
              onClick={() => setOpen(false)}
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}
