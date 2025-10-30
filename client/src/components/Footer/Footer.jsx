import "./Footer.css";
import { Link } from "react-router-dom";
import { images } from "../../assets";

export default function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className="footer">
      <div className="footer-inner content-container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src={images.logo} alt="logo" className="logo-image-footer" />
            <span className="logo-text">Job Compass</span>
          </Link>
        </div>

        <div className="copyright">
          <p>© {new Date().getFullYear()} Job Compass</p>
        </div>

        {/* back to top button */}
        <button
          type="button"
          onClick={handleBackToTop}
          aria-label="Back to top"
          className="back-btn"
        >
          Back to top
        </button>
      </div>
    </footer>
  );
}
