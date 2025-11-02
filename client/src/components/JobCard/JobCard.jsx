import "./JobCard.css";
export default function JobCard({
  job,
  favorites,
  onFavoriteToggle,
  onApplyClick,
}) {
  return (
    <li key={job.id} className="job-item">
      <div className="job-card">
        <div className="job-card-content">
          <div className="company-logo-container">
            <img
              src={job.companyLogo || "placeholder-logo.png"}
              alt={job.companyName || "Company Logo"}
              className="company-logo"
            />
          </div>

          <div className="job-info">
            <div className="job-card-header">
              <h3 className="job-title">{job.title}</h3>
              <button
                className={`favorite-btn ${
                  (favorites[job.id] ?? job.isFavorite) ? "favorited" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle(job.id);
                }}
              >
                {(favorites[job.id] ?? job.isFavorite) ? "♥" : "♡"}
              </button>
            </div>

            <div className="job-tags">
              {[
                job.seniorityLevel,
                job.employmentType,
                job.workMode,
                job.location,
              ].map(
                (tag, idx) =>
                  tag && (
                    <span key={idx} className="job-tag-item">
                      {tag}
                    </span>
                  ),
              )}
            </div>

            <p className="job-description">
              {job.descriptionText
                ? job.descriptionText.substring(0, 150) + "..."
                : "No description available."}
            </p>

            <div className="job-card-footer">
              <div className="skill-match-container">
                <span className="skill-match-text">
                  Skills Match ({job.skillMatch || "N/A"})
                </span>
                <span className="skill-match-tag">Match</span>
              </div>

              <button
                className="more-apply-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyClick(job);
                }}
              >
                More & Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
