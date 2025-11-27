import JobCard from "../../components/JobCard/JobCard";
import { UseUser } from "../../context/UserContext";

export default function MyFavorites() {
  const { user, toggleFavorite } = UseUser();
  const favoriteJobs = Array.isArray(user?.favorites) ? user.favorites : [];

  if (favoriteJobs.length === 0) {
    return (
      <div className="page-content content-container">
        <div className="page-header-container">
          <h2>My Favorite Jobs ❤️</h2>
        </div>
        <p>You have no favorited jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="page-content content-container">
      <div className="page-header-container">
        <h2>My Favorite Jobs ❤️</h2>
      </div>

      <section className="results-summary">
        <h3 className="results-title">
          Saved Jobs
          <span className="results-count"> ({favoriteJobs.length} found)</span>
        </h3>
      </section>

      <ul className="jobs-list">
        {favoriteJobs.length === 0 ? (
          <p>No favorite jobs yet.</p>
        ) : (
          favoriteJobs.map((job, idx) => (
            <JobCard
              key={job.id ? job.id : `favorite-${idx}`}
              job={job}
              onApplyClick={(job) =>
                window.open(job.applyUrl || job.link, "_blank")
              }
              user={user}
              toggleFavorite={toggleFavorite}
              isInFavorites={true}
            />
          ))
        )}
      </ul>
    </div>
  );
}
