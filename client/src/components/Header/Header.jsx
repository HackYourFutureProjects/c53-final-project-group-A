import "./Header.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { images, icons } from "../../assets";

//dropdown menu
function UserMenu() {
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
        <span className="user-name">Guest</span>

        <img
          src={icons.arrow}
          alt=""
          className={`arrow ${open ? "arrow-open" : ""}`}
        />
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <Link to="/profile" className="user-item" role="menuitem">
            Profile
          </Link>
          <Link to="/about" className="user-item" role="menuitem">
            About
          </Link>
          <Link to="/login" className="user-item" role="menuitem">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  return (
    <header className="app-header">
      <nav className="header-nav">
        <div className="brand">
          <img src={images.logo} alt="logo" className="logo-image-header" />
          <span className="logo-text">Job Compass</span>
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/jobs" className="nav-link">
            Job listing
          </Link>
          <Link to="/favorites" className="nav-link">
            Favorites
          </Link>
        </div>

        <div className="header-actions">
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}
