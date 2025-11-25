import { useRef, useState } from "react";
import { validateSkillInput } from "../util/skillValidation";
import AlertMessage from "./AlertMessage";
import { regexEndNormalizeSkill } from "../util/regexEndNormalizeSkill";
import { cleanUpText } from "../util/cleanUpText";
import { UseUser } from "../context/UserContext";

export default function SkillsSettings() {
  const skillInputRef = useRef(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const { user, dispatch } = UseUser();
  const { skills } = user;

  function handleClearAlert() {
    if (!alert.message) return;
    setAlert({ type: "", message: "" });
  }

  async function addSkill() {
    const skillInput = skillInputRef.current;
    if (!skillInput) return;
    const newSkill = cleanUpText(skillInput.value || "");

    const validationError = validateSkillInput({ text: newSkill, skills });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    try {
      // const data = await authFetch("/favorites/toggle", {
      //   method: "POST",
      //   body: JSON.stringify({ jobId: job.id, jobData: job }),
      // });

      dispatch({
        type: "ADD_SKILL",
        payload: regexEndNormalizeSkill(newSkill),
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

  function removeSkill(skill) {
    dispatch({ type: "REMOVE_SKILL", payload: skill });
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
            onClick={() => dispatch({ type: "REMOVE_ALL_SKILLS" })}
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
    </div>
  );
}
