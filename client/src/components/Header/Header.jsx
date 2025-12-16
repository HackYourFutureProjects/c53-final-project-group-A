import "./Header.css";
import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { images } from "../../assets";
import { UseUser } from "../../context/UserContext";
import UserMenu from "../UserMenu";

export default function Header() {
  const { message, clearMessage } = UseUser();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  return (
    <header className="app-header">
      {message && (
        <div className="alert-message" onClick={clearMessage} role="alert">
          <p>{message}</p>
        </div>
      )}
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
