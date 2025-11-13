import Skills from "../Skills";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UseAuth } from "../../context/AuthContext";
import PopupForMoreAndApply from "../SuccessPopup/PopupForMoreAndApply";
import "./JobCard.css";
import { icons } from "../../assets";

export default function JobCard({ job, onFavoriteToggle }) {
  const navigate = useNavigate();
  const { user } = UseAuth();
  const favorites = Array.isArray(user?.favorites) ? user.favorites : [];

  //  New state for showing popup
  const [showPopup, setShowPopup] = useState(false);

  const handleApplyClick = (e) => {
    e.stopPropagation();

    if (user) {
      window.open(job.applyLink || job.url, "_blank");
      return;
    }

    setShowPopup(true);
  };

  const handleLoginRedirect = () => {
    setShowPopup(false);
    navigate("/login", {});
  };

  const workMode = job.workMode || "On-site";
  const location = job.displayLocation || null;

  return (
    <li key={job.id} className="job-item">
      <div className="job-card">
        <div className="job-card-content">
          <div className="company-logo-container">
            <img
              src={job.organization_logo || icons.defaultCompany}
              alt={job.organization_name || "Company logo"}
              className="company-logo"
            />
          </div>

          <div className="job-info">
            <div className="job-card-header">
              <h3 className="job-title">{job.title}</h3>
              <button
                className={`favorite-btn ${
                  (Array.isArray(favorites)
                    ? favorites.includes(job.id)
                    : false) || job.isFavorite
                    ? "favorited"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle(job.id);
                }}
              >
                {(Array.isArray(favorites)
                  ? favorites.includes(job.id)
                  : false) || job.isFavorite
                  ? "♥"
                  : "♡"}
              </button>
            </div>

            <div className="job-tags">
              {[job.seniority, job.employment_type, workMode, location].map(
                (tag, idx) =>
                  tag && (
                    <span key={idx} className="job-tag-item">
                      {tag}
                    </span>
                  ),
              )}
            </div>

            <p className="job-description">
              {job.linkedin_org_description
                ? job.linkedin_org_description.substring(0, 150) + "..."
                : "No description available."}
            </p>

            <div className="job-card-footer">
              <div className="skill-match-container">
                <span className="skill-match-text">
                  <Skills item={job} />
                </span>
              </div>

              <button className="more-apply-btn" onClick={handleApplyClick}>
                More & Apply
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <PopupForMoreAndApply
          handleLoginRedirect={handleLoginRedirect}
          setShowPopup={setShowPopup}
        />
      )}
    </li>
  );
}
