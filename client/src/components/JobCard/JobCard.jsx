import Skills from "../Skills";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UseUser } from "../../context/UserContext";
import PopupForMoreAndApply from "../SuccessPopup/PopupForMoreAndApply";
import PopupForFavorites from "../SuccessPopup/PopupForFavorites";
import "./JobCard.css";
import { icons } from "../../assets";
import { defaultUser } from "../../data/defaultUser";
import { Bus, Briefcase, UserCheck, Monitor, MapPin } from "lucide-react";

export default function JobCard({ job, onApplyClick }) {
  const navigate = useNavigate();
  const { user, dispatch } = UseUser();
  const favorites = Array.isArray(user?.favorites) ? user.favorites : [];

  //  New state for showing popup
  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);

  const handleApplyClick = (e) => {
    e.stopPropagation();

    if (user && user.email !== defaultUser.email) {
      if (onApplyClick) {
        window.open(job.applyLink || job.url, "_blank");
      }
      return;
    }

    setShowApplyPopup(true);
  };

  const handleLoginRedirect = () => {
    setShowApplyPopup(false);
    setShowFavoritesPopup(false);
    navigate("/login", {});
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();

    if (user && user.email !== defaultUser.email) {
      dispatch({ type: "TOGGLE_FAVORITE", payload: job.id });
    } else {
      setShowFavoritesPopup(true);
    }
  };

  const workMode = job.workMode || "On-site";
  const location = job.displayLocation || null;
  const isFavorited = favorites[job.id] ?? job.isFavorite;

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
                  favorites.includes(job.id) || job.isFavorite
                    ? "favorited"
                    : ""
                }`}
                onClick={handleFavoriteClick}
                title={
                  isFavorited ? "Remove from favourites" : "Save to favourites"
                }
              >
                {favorites.includes(job.id) || job.isFavorite ? "♥" : "♡"}
              </button>
            </div>

            <div className="job-tags">
              {/* seniority tag */}
              {job.seniority && (
                <div className="job-commute-info">
                  <UserCheck className="bus-icon" />
                  <span className="job-commute">{job.seniority}</span>
                </div>
              )}

              {/* employment type tag */}
              {job.employment_type && (
                <div className="job-commute-info">
                  <span className="job-tag-separator">|</span>
                  <Briefcase className="bus-icon" />
                  <span className="job-commute">{job.employment_type}</span>
                </div>
              )}

              {/* work mode tag */}
              {workMode && (
                <div className="job-commute-info">
                  <span className="job-tag-separator">|</span>
                  <Monitor className="bus-icon" />
                  <span className="job-commute">{workMode}</span>
                </div>
              )}

              {/* location tag */}
              {location && (
                <div className="job-commute-info">
                  <span className="job-tag-separator">|</span>
                  <MapPin className="bus-icon" />
                  <span className="job-commute">{location}</span>
                </div>
              )}

              {/* commute info block */}
              {job.travelInfo && job.travelInfo.success && (
                <div className="job-commute-info">
                  <span className="job-tag-separator">|</span>
                  <Bus className="bus-icon" />

                  <span className="job-commute">
                    {job.travelInfo.averageTravelTimeMinutes} min,{" "}
                    {job.travelInfo.leastTransfers} transfer
                    {job.travelInfo.leastTransfers !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {job.travelInfo && !job.travelInfo.success && (
                <div className="job-commute-info error">
                  Commute info unavailable
                </div>
              )}
            </div>

            <p className="job-description">
              {job.description_text
                ? job.description_text.substring(0, 150) + "..."
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
      {showApplyPopup && (
        <PopupForMoreAndApply
          handleLoginRedirect={handleLoginRedirect}
          setShowPopup={setShowApplyPopup}
        />
      )}
      {showFavoritesPopup && (
        <PopupForFavorites
          handleLoginRedirect={handleLoginRedirect}
          setShowPopup={setShowFavoritesPopup}
        />
      )}
    </li>
  );
}
