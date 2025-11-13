import "./Header.css";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { images, icons } from "../../assets";
import { UseAuth } from "../../context/AuthContext.jsx";

//dropdown menu
function UserMenu() {
  const { user, logout } = UseAuth();
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
    await logout(); // log out the user
    setOpen(false); // close dropdown
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
          src={images.defaultAvatar}
          alt="user avatar"
          className="user-avatar"
        />
        <span className="divider"></span>
        <span className="user-name">{user ? user.firstName : "Guest"}</span>

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
          {user ? (
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

export default function Header() {
  return (
    <header className="app-header">
      <nav className="header-nav">
        <Link to="/" className="brand">
          <img src={images.logo} alt="logo" className="logo-image-header" />
          <span className="logo-text-header">Job Compass</span>
        </Link>

        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }
          >
            Job search
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }
          >
            Open positions
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? "user-item active" : "user-item"
            }
          >
            My favorites
          </NavLink>
        </div>

        <div className="header-actions">
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}
