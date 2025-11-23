import Skills from "../Skills";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import PopupForMoreAndApply from "../SuccessPopup/PopupForMoreAndApply";
import PopupForFavorites from "../SuccessPopup/PopupForFavorites";
import "./JobCard.css";
import { icons, gif } from "../../assets";
import { defaultUser } from "../../data/defaultUser";
import {
  Bus,
  Briefcase,
  Clock,
  GraduationCap,
  MapPin,
  Monitor,
} from "lucide-react";

function formatTravelTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export default function JobCard({
  job,
  onApplyClick,
  isTravelLoading,
  favorites,
  dispatch,
  user,
}) {
  const navigate = useNavigate();

  const isFavorited = favorites.includes(job.id) || job.isFavorite;

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
                {favorites ? "♥" : "♡"}
              </button>
            </div>

            <div className="job-tags">
              {/* seniority tag */}
              {job.seniority && job.seniority !== "Niet van toepassing" && (
                <div className="job-commute-info">
                  <GraduationCap className="job-icon" />
                  <span className="job-commute">{job.seniority}</span>
                  <span className="job-tag-separator">|</span>
                </div>
              )}

              {/* employment type tag */}
              {job.employment_type && (
                <div className="job-commute-info">
                  <Briefcase className="job-icon" />
                  <span className="job-commute">{job.employment_type}</span>
                  <span className="job-tag-separator">|</span>
                </div>
              )}
              {/* work mode tag */}
              {job.workMode && (
                <div className="job-commute-info">
                  <Monitor className="job-icon" />
                  <span className="job-commute">{job.workMode}</span>
                  <span className="job-tag-separator">|</span>
                </div>
              )}
              {/* location tag */}
              {job.displayLocation && (
                <div className="job-commute-info">
                  <MapPin className="job-icon" />
                  <span className="job-commute">{job.displayLocation}</span>
                  <span className="job-tag-separator">|</span>
                </div>
              )}
              {/* posting date tag */}
              {job.date_posted &&
                (() => {
                  const d = new Date(job.date_posted);
                  if (isNaN(d)) return null;
                  const dd = String(d.getDate()).padStart(2, "0");
                  const monthNames = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ];
                  const mm = monthNames[d.getMonth()];
                  const yyyy = d.getFullYear();
                  const formatted = `${dd} ${mm} ${yyyy}`;
                  return (
                    <div className="job-commute-info">
                      <Clock className="job-icon" />
                      <span className="job-commute">{formatted}</span>
                      <span className="job-tag-separator">|</span>
                    </div>
                  );
                })()}

              {/* commute info block*/}
              <div className="job-commute-info">
                {isTravelLoading && !job.travelInfo ? (
                  <img
                    src={gif.spinner}
                    alt="Loading..."
                    className="travel-spinner"
                  />
                ) : job.travelInfo?.success ? (
                  <>
                    <Bus className="bus-icon" />
                    <span className="job-commute">
                      {formatTravelTime(
                        job.travelInfo.averageTravelTimeMinutes,
                      )}
                      {", "}
                      {job.travelInfo.leastTransfers} transfer
                      {job.travelInfo.leastTransfers !== 1 ? "s" : ""}
                    </span>
                  </>
                ) : (
                  <span className="job-commute error">
                    Commute info unavailable
                  </span>
                )}
              </div>
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
