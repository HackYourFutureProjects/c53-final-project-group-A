// React imports
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Context, Component imports
import { UseUser } from "../../context/UserContext";
import AlertMessage from "../AlertMessage/AlertMessage";
import PopupForSave from "../SuccessPopup/PopupForSave";
// Hook & Utility imports
import useFetch from "../../hooks/useFetch";
import { cleanUpText } from "../../util/cleanUpText";
import { regexEndNormalizeSkill } from "../../util/regexEndNormalizeSkill";
import { validateSkillInput } from "../../util/skillValidation";
import { gif } from "../../assets/index.js";
// Styles
import "./SkillsSettings.css";

export default function SkillsSettings() {
  const navigate = useNavigate();
  const skillInputRef = useRef(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showAll, setShowAll] = useState(false);
  const maxVisible = 4;
  const ALERT_CLEAR_DELAY_MS = 2000;
  const { user, dispatch } = UseUser();
  const { skills } = user;
  const [showSavePopup, setShowSavePopup] = useState(false);
  const handleSkillsResultsRef = useRef(() => {});
  const clearAlertTimeoutRef = useRef(null);

  function handleClearAlert() {
    setAlert({ type: "", message: "" });
  }

  function delayedClearAlert() {
    // Clear any existing timeout before setting a new one
    if (clearAlertTimeoutRef.current) {
      clearTimeout(clearAlertTimeoutRef.current);
      clearAlertTimeoutRef.current = null;
    }
    clearAlertTimeoutRef.current = setTimeout(() => {
      handleClearAlert();
    }, ALERT_CLEAR_DELAY_MS);
  }

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (clearAlertTimeoutRef.current) {
        clearTimeout(clearAlertTimeoutRef.current);
        clearAlertTimeoutRef.current = null;
      }
    };
  }, []);

  const {
    isLoading,
    error: fetchError,
    performFetch,
  } = useFetch("/users/change-skills", (result) =>
    handleSkillsResultsRef.current(result),
  );

  useEffect(() => {
    if (fetchError) {
      setAlert({ type: "error", message: String(fetchError) });
      delayedClearAlert();
    }
  }, [fetchError]);

  function prepareSkillsUpdate(nextSkills, successMessage) {
    handleSkillsResultsRef.current = async () => {
      dispatch({
        type: "SET_SKILLS",
        payload: nextSkills,
      });
      setAlert({
        type: "success",
        message: successMessage,
      });
    };
  }

  async function changeSkillsHelper(skills) {
    const skillNames = skills.map((s) => s.skill);

    performFetch({
      method: "POST",
      body: JSON.stringify({ skills: skillNames }),
      credentials: "include",
    });
  }

  // -------------------- ADD SKILL --------------------
  async function addSkill() {
    if (!user?.userid) {
      setShowSavePopup(true);
      return;
    }
    const skillInput = skillInputRef.current;
    if (!skillInput) return;
    const newSkill = cleanUpText(skillInput.value || "");
    const validationError = validateSkillInput({ text: newSkill, skills });
    if (validationError) {
      setAlert({ type: "error", message: String(validationError) });
      delayedClearAlert();
      return;
    }

    const prevSkills = Array.isArray(user?.skills) ? user.skills : [];
    const combined = [...prevSkills, regexEndNormalizeSkill(newSkill)].sort(
      (a, b) =>
        String(a?.normalizedSkill ?? "").localeCompare(
          String(b?.normalizedSkill ?? ""),
        ),
    );

    prepareSkillsUpdate(
      combined,
      "The skill has been added to the user's profile!",
    );
    await changeSkillsHelper(combined);
    delayedClearAlert();

    if (skillInput) {
      skillInput.value = "";
      skillInput.focus();
    }
  }

  // -------------------- REMOVE SKILL --------------------
  async function removeSkill(skill) {
    if (!user?.userid) {
      setShowSavePopup(true);
      return;
    }
    const prevSkills = Array.isArray(user?.skills) ? user.skills : [];
    const filtered = prevSkills.filter((s) => s.skill !== skill.skill);

    prepareSkillsUpdate(
      filtered,
      "The skill has been removed from the user's profile!",
    );
    await changeSkillsHelper(filtered);
    delayedClearAlert();
  }
  // -------------------- REMOVE ALL SKILLS --------------------
  async function removeAllSkills() {
    if (!user?.userid) {
      setShowSavePopup(true);
      return;
    }

    prepareSkillsUpdate(
      [],
      "All skills have been removed from the user's profile!",
    );
    await changeSkillsHelper([]);
    delayedClearAlert();
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
            {isLoading && (
              <img src={gif.spinner} alt="Loading..." className="spinner" />
            )}
          </button>

          <button
            id="removeAllSkillsBtn"
            onClick={removeAllSkills}
            className="remove-all-btn"
            type="button"
          >
            Remove all
            {isLoading && (
              <img src={gif.spinner} alt="Loading..." className="spinner" />
            )}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <img src={gif.spinner} alt="Loading..." className="spinner" />
                ) : (
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
                )}
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
      {showSavePopup && (
        <PopupForSave
          title="You are not logged in"
          message="Please log in or sign up to manage your skills."
          handleLoginRedirect={() => {
            navigate("/login");
            setShowSavePopup(false);
          }}
          setShowSavePopup={setShowSavePopup}
        />
      )}
    </div>
  );
}
