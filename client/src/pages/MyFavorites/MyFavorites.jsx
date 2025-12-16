import { useMemo } from "react";
import JobCard from "../../components/JobCard/JobCard";
import { UseUser } from "../../context/UserContext";
import getSkillsInDescription from "../../util/getSkillsInDescription";
import "./MyFavorites.css";

export default function MyFavorites() {
  const { user } = UseUser();
  const favoriteJobs = Array.isArray(user?.favorites) ? user.favorites : [];
  const skills = Array.isArray(user?.skills) ? user.skills : [];

  const jobsWithSkills = useMemo(() => {
    return favoriteJobs.map((job) => {
      const skillsInDescription = getSkillsInDescription(
        job.normalized_description || "",
        skills,
      );
      return {
        ...job,
        skillsInDescription,
        skillsMatch: String(skillsInDescription.length).padStart(2, "0"),
      };
    });
  }, [favoriteJobs, skills]);

  if (favoriteJobs.length === 0) {
    return (
      <div className="page-content content-container">
        <div className="page-header-container">
          <h2>My favorite jobs</h2>
        </div>
        <p className="favorites-no-found">You have no favorited jobs yet.</p>
      </div>
    );
  } else {
    return (
      <div className="page-content content-container">
        <div className="page-header-container">
          <h2>My favorite jobs</h2>
        </div>

        <section className="results-summary">
          <h3 className="results-title">
            Saved jobs
            <span className="results-count">
              {" "}
              ({favoriteJobs.length} found)
            </span>
          </h3>
        </section>

        <ul className="jobs-list">
          {jobsWithSkills.map((job, idx) => (
            <JobCard
              key={job.id ? job.id : `favorite-${idx}`}
              job={job}
              onApplyClick={(job) =>
                window.open(job.applyUrl || job.link, "_blank")
              }
              isInFavorites={true}
            />
          ))}
        </ul>
      </div>
    );
  }
}
