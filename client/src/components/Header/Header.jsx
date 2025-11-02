import "./Header.css";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { images, icons } from "../../assets";

//dropdown menu
function UserMenu({ user }) {
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
          src={images.defaultAvatar}
          alt="user avatar"
          className="user-avatar"
        />
        <span className="divider"></span>
        <span className="user-name">{user.name}</span>

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
          >
            Profile
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }
            role="menuitem"
          >
            About
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }
            role="menuitem"
          >
            Login
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default function Header({ user }) {
  return (
    <header className="app-header">
      <nav className="header-nav">
        <div className="brand">
          <img src={images.logo} alt="logo" className="logo-image-header" />
          <span className="logo-text">Job Compass</span>
        </div>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }>
            Home
          </NavLink>
          <NavLink to="/jobs" className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }>
            Job listing
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }>
            Favorites
          </NavLink>
        </div>

        <div className="header-actions">
          <UserMenu user={user} />
        </div>
      </nav>
    </header>
  );
}
