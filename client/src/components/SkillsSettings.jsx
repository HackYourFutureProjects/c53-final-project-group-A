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

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        Skills
      </label>
      <div className="flex gap-3 mb-3">
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
          Add
        </button>
      </div>
      {alert.message && (
        <AlertMessage type={alert.type} message={alert.message} />
      )}
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
  );
}
