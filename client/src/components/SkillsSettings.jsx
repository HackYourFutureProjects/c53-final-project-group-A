import { useEffect, useRef, useState } from "react";
import { validateSkillInput } from "../util/skillValidation";
import AlertMessage from "./AlertMessage";
import { regexEndNormalizeSkill } from "../util/regexEndNormalizeSkill";
import { cleanUpText } from "../util/cleanUpText";
import { useAuth } from "../context/AuthContext";

export default function SkillsSettings() {
  const skillInputRef = useRef(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const { user, setUser } = useAuth();
  const { skills } = user;

  useEffect(() => {
    if (alert.message && skills) {
      // Defer clearing the alert to avoid synchronous setState inside the effect
      // which can trigger cascading renders and is flagged by the linter.
      const tid = setTimeout(() => setAlert({ type: "", message: "" }), 0);
      return () => clearTimeout(tid);
    }
  }, [skills]);

  function addSkill() {
    const skillInput = skillInputRef.current;
    if (!skillInput) return;
    const newSkill = cleanUpText(skillInput.value || "");

    const validationError = validateSkillInput({ text: newSkill, skills });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    setUser((prev) => {
      const newUser = { ...prev };
      newUser.skills = [
        ...(newUser.skills || []),
        regexEndNormalizeSkill(newSkill),
      ].sort((a, b) =>
        String(a?.normalizedSkill ?? "").localeCompare(
          String(b?.normalizedSkill ?? ""),
        ),
      );
      return newUser;
    });

    if (skillInput) {
      skillInput.value = "";
      skillInput.focus();
    }
  }

  function removeSkill(skill) {
    setUser((prev) => {
      const newUser = { ...prev };
      newUser.skills = (newUser.skills || []).filter(
        (s) => s.skill !== skill.skill,
      );
      return newUser;
    });
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
        />
        <button
          id="addSkillBtn"
          onClick={addSkill}
          className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
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
