import { useRef, useState } from "react";
import { validateSkillInput } from "../util/skillValidation";
import AlertMessage from "./AlertMessage";
import { regexEndNormalizeSkill } from "../util/regexEndNormalizeSkill";
import { cleanUpText } from "../util/cleanUpText";
import { UseUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import PopupForSave from "../components/SuccessPopup/PopupForSave";

export default function SkillsSettings() {
  const navigate = useNavigate();
  const skillInputRef = useRef(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const { user, dispatch, authFetch } = UseUser();
  const { skills } = user;
  const [showSavePopup, setShowSavePopup] = useState(false);

  function handleClearAlert() {
    if (!alert.message) return;
    setAlert({ type: "", message: "" });
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
    if (!user?.userid) {
      setShowSavePopup(true);
      return;
    }
    const skillInput = skillInputRef.current;
    if (!skillInput) return;
    const newSkill = cleanUpText(skillInput.value || "");
    const validationError = validateSkillInput({ text: newSkill, skills });
    if (validationError) {
      setAlert(validationError);
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
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    }

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
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    }
  }
  // -------------------- REMOVE ALL SKILLS --------------------
  async function removeAllSkills() {
    if (!user?.userid) {
      setShowSavePopup(true);
      return;
    }
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
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    }
  }

  return (
    <div className="mt-4">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Change Skill Set
        </label>
        {/* Skills List */}
        <div id="skillsList">
          {(skills || []).map((s, idx) => (
            <div
              key={`${s.skill}-${idx}`}
              className="inline-flex items-center bg-white border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <span className="text-gray-800 mr-2">{s.skill}</span>
              <button
                className="text-gray-500 hover:text-red-600 transition"
                onClick={() => removeSkill(s)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Skills management */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        {/* <div className="flex gap-3 mb-3"> */}
        <div></div>
        <div className="flex gap-3 mb-3">
          <button
            id="removeAllSkillsBtn"
            onClick={() => removeAllSkills()}
            className="px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium"
          >
            Remove All
          </button>
          <input
            id="skillInput"
            ref={skillInputRef}
            type="text"
            placeholder="e.g. React, TypeScript, Docker"
            className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") addSkill();
            }}
            onChange={handleClearAlert}
          />
          <button
            id="addSkillBtn"
            onClick={addSkill}
            className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800 transition font-medium"
          >
            Add Skill
          </button>
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
