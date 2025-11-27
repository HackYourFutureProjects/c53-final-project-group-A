import { useRef, useState } from "react";
import { validateSkillInput } from "../util/skillValidation";
import AlertMessage from "./AlertMessage";
import { regexEndNormalizeSkill } from "../util/regexEndNormalizeSkill";
import { cleanUpText } from "../util/cleanUpText";
import { UseUser } from "../context/UserContext";
import "./skillsSettings.css";

export default function SkillsSettings() {
  const skillInputRef = useRef(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showAll, setShowAll] = useState(false);
  const maxVisible = 7;
  const { user, dispatch } = UseUser();
  const { skills } = user;

  function handleClearAlert() {
    if (!alert.message) return;
    setAlert({ type: "", message: "" });
  }

  function addSkill() {
    const skillInput = skillInputRef.current;
    if (!skillInput) return;
    const newSkill = cleanUpText(skillInput.value || "");

    const validationError = validateSkillInput({ text: newSkill, skills });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    // dispatch normalized skill to reducer which will add & sort
    dispatch({ type: "ADD_SKILL", payload: regexEndNormalizeSkill(newSkill) });

    if (skillInput) {
      skillInput.value = "";
      skillInput.focus();
    }
  }

  function removeSkill(skill) {
    dispatch({ type: "REMOVE_SKILL", payload: skill });
  }
  const visibleSkills = showAll ? skills : skills.slice(0, maxVisible);

  return (
    <div className="skills-container">
      <div className="skills-section">
        <h3 className="skills-heading">Skills</h3>
        <label className="skills-label" htmlFor="skillInput">
          Add skills
        </label>

        {/* Skills management */}
        <div className="skills-management">
          <div className="skills-controls">
            <input
              id="skillInput"
              ref={skillInputRef}
              type="text"
              placeholder="e.g. React, TypeScript, Docker"
              className="skill-input"
              onKeyDown={(e) => {
                if (e.key === "Enter") addSkill();
              }}
              onChange={handleClearAlert}
            />

            <button
              id="addSkillBtn"
              onClick={addSkill}
              className="add-skill-btn"
              type="button"
            >
              Add
            </button>

            <button
              id="removeAllSkillsBtn"
              onClick={() => dispatch({ type: "REMOVE_ALL_SKILLS" })}
              className="remove-all-btn"
              type="button"
            >
              Remove all
            </button>
          </div>
        </div>

        {/* Skills List */}
        <div id="skillsList" className="skills-list">
          {visibleSkills.map((s, idx) => (
            <div key={`${s.skill}-${idx}`} className="skill-item">
              <span className="skill-name">{s.skill}</span>
              <button
                className="skill-remove-btn"
                onClick={() => removeSkill(s)}
                aria-label={`Remove ${s.skill}`}
                type="button"
              >
                <svg
                  className="skill-remove-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}

          {skills.length > maxVisible && (
            <button
              className="show-all-btn"
              onClick={() => setShowAll(!showAll)}
              type="button"
            >
              {" "}
              {showAll
                ? "Show less"
                : `+${skills.length - maxVisible} more`}{" "}
            </button>
          )}
        </div>
      </div>

      {alert.message && (
        <AlertMessage type={alert.type} message={alert.message} />
      )}
    </div>
  );
}
