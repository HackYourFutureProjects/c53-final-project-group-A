import { useRef, useState } from "react";
import { validateSkillInput } from "../util/skillValidation";
import AlertMessage from "./AlertMessage";
import { regexEndNormalizeSkill } from "../util/regexEndNormalizeSkill";
import { cleanUpText } from "../util/cleanUpText";
import { UseUser } from "../context/UserContext";
import "./SkillsSettings.css";

export default function SkillsSettings() {
  const skillInputRef = useRef(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showAll, setShowAll] = useState(false);
  const maxVisible = 4;
  const { user, dispatch, authFetch } = UseUser();
  const { skills } = user;

  function handleClearAlert() {
    setAlert({ type: "", message: "" });
  }

  function delayedClearAlert() {
    return new Promise(() => {
      setTimeout(() => {
        handleClearAlert();
      }, 2000);
    });
  }

  async function changeSkillsHelper(skills) {
    const skillNames = skills.map((s) => s.skill);

    await authFetch("/change-skills", {
      method: "POST",
      body: JSON.stringify({ skills: skillNames }),
    });
  }

  // -------------------- ADD SKILL --------------------
  async function addSkill() {
    const skillInput = skillInputRef.current;
    if (!skillInput) return;
    const newSkill = cleanUpText(skillInput.value || "");
    const validationError = validateSkillInput({ text: newSkill, skills });
    if (validationError) {
      setAlert({ type: "error", message: String(validationError) });
      await delayedClearAlert();
      return;
    }

    const prevSkills = Array.isArray(user?.skills) ? user.skills : [];
    const combined = [...prevSkills, regexEndNormalizeSkill(newSkill)].sort(
      (a, b) =>
        String(a?.normalizedSkill ?? "").localeCompare(
          String(b?.normalizedSkill ?? ""),
        ),
    );

    try {
      await changeSkillsHelper(combined);
      dispatch({
        type: "SET_SKILLS",
        payload: combined,
      });
      setAlert({
        type: "success",
        message: "The skill has been added to the user's profile!",
      });
      await delayedClearAlert();
    } catch (err) {
      setAlert({ type: "error", message: String(err?.message || err) });
      await delayedClearAlert();
    }

    if (skillInput) {
      skillInput.value = "";
      skillInput.focus();
    }
  }

  // -------------------- REMOVE SKILL --------------------
  async function removeSkill(skill) {
    const prevSkills = Array.isArray(user?.skills) ? user.skills : [];
    const filtered = prevSkills.filter((s) => s.skill !== skill.skill);
    try {
      await changeSkillsHelper(filtered);
      dispatch({
        type: "SET_SKILLS",
        payload: filtered,
      });
      setAlert({
        type: "success",
        message: "The skill has been removed from the user's profile!",
      });
      await delayedClearAlert();
    } catch (err) {
      setAlert({ type: "error", message: String(err?.message || err) });
      await delayedClearAlert();
    }
  }
  // -------------------- REMOVE ALL SKILLS --------------------
  async function removeAllSkills() {
    try {
      await changeSkillsHelper([]);
      dispatch({
        type: "SET_SKILLS",
        payload: [],
      });
      setAlert({
        type: "success",
        message: "All skills have been removed from the user's profile!",
      });
      await delayedClearAlert();
    } catch (err) {
      setAlert({ type: "error", message: String(err?.message || err) });
      await delayedClearAlert();
    }
  }
  const visibleSkills = showAll ? skills : skills.slice(0, maxVisible);

  return (
    <div className="skills-container">
      <div className="skills-section">
        <h3 className="skills-heading">Skills</h3>

        {/* Skills management */}
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
            Add skill
          </button>

          <button
            id="removeAllSkillsBtn"
            onClick={removeAllSkills}
            className="remove-all-btn"
            type="button"
          >
            Remove all
          </button>
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
              {showAll ? "Show less" : `+${skills.length - maxVisible} more`}
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
