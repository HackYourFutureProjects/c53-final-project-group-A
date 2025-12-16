import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bus,
  Briefcase,
  Clock,
  GraduationCap,
  MapPin,
  Monitor,
} from "lucide-react";
// Assets & data
import { icons, gif } from "../../assets";
import { defaultUser } from "../../data/defaultUser";
// Context, Components, styles
import { UseUser } from "../../context/UserContext";
import { UseJobs } from "../../context/JobsContext";
import useFetch from "../../hooks/useFetch";
import Skills from "../Skills";
import PopupForMoreAndApply from "../SuccessPopup/PopupForMoreAndApply";
import PopupForFavorites from "../SuccessPopup/PopupForFavorites";
import "./JobCard.css";

function formatTravelTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export default function JobCard({ job, onApplyClick, isInFavorites }) {
  const navigate = useNavigate();
  const { user, dispatch, setMessage } = UseUser();
  const { isTravelLoading } = UseJobs();

  //  New state for showing popup
  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);

  const { isLoading: isToggleFavoriteLoading, performFetch } = useFetch(
    "/users/favorites/toggle",
    (data) => {
      dispatch({ type: "TOGGLE_FAVORITE", payload: data.job });
      setMessage(
        data.action === "added"
          ? "Job added to favorites!"
          : "Job removed from favorites!",
      );
    },
  );

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (user.email !== defaultUser.email) {
      performFetch({
        method: "POST",
        body: JSON.stringify({ job }),
        credentials: "include",
      });
    } else {
      setShowFavoritesPopup(true);
    }
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    if (user.email !== defaultUser.email) {
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

  return (
    <li className="job-item">
      <div className="job-card">
        <div className="job-card-content">
          <div className="company-logo-container">
            <a
              href={job.organization_url}
              target="_blank"
              rel="noopener noreferrer"
              className="company-link"
            >
              <img
                src={job.organization_logo || icons.defaultCompany}
                alt={job.organization_name || "Company logo"}
                className="company-logo"
              />
              <span className="company-name">
                {job.organization_name || job.organization}
              </span>
            </a>
          </div>

          <div className="job-info">
            <div className="job-card-header">
              <h3 className="job-title">{job.title}</h3>
              <button
                className={`favorite-btn ${isInFavorites ? "favorited" : ""}`}
                onClick={handleFavoriteClick}
                disabled={isToggleFavoriteLoading}
                title={
                  isInFavorites
                    ? "Remove from favourites"
                    : "Save to favourites"
                }
              >
                {isToggleFavoriteLoading ? (
                  <img src={gif.spinner} alt="Loading..." className="spinner" />
                ) : isInFavorites ? (
                  "♥"
                ) : (
                  "♡"
                )}
              </button>
            </div>

            <div className="job-tags">
              {/* seniority tag */}
              {job.seniority && (
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
              {job.work_mode && (
                <div className="job-commute-info">
                  <Monitor className="job-icon" />
                  <span className="job-commute">{job.work_mode}</span>
                  <span className="job-tag-separator">|</span>
                </div>
              )}
              {/* location tag */}
              {job.display_location && (
                <div className="job-commute-info">
                  <MapPin className="job-icon" />
                  <span className="job-commute">{job.display_location}</span>
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
                {isTravelLoading ? (
                  <img src={gif.spinner} alt="Loading..." className="spinner" />
                ) : (
                  job.travel_time != null &&
                  job.least_transfers != null && (
                    <>
                      <Bus className="job-icon" />
                      <span className="job-commute">
                        {formatTravelTime(job.travel_time)},{" "}
                        {job.least_transfers} transfer
                        {job.least_transfers !== 1 ? "s" : ""}
                      </span>
                    </>
                  )
                )}
              </div>
            </div>

            <p className="job-description">
              {job.description_text
                ? job.description_text.substring(0, 350) + "..."
                : "No description available."}
            </p>

            <div className="job-card-footer">
              <div className="skill-match-container">
                {job.skillsInDescription && (
                  <span className="skill-match-text">
                    <Skills job={job} />
                  </span>
                )}
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
