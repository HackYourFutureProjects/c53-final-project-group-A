import { useEffect, useRef, useState } from "react";
import { UseSettings } from "../../context/SettingsContext";
import { validateSkillInput } from "../../util/skillValidation";
import AlertMessage from "../../components/AlertMessage";
import { regexEndNormalizeSkill } from "../../util/regexEndNormalizeSkill";

export default function Profile() {
  const skillInputRef = useRef(null);
  const skillsListRef = useRef(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const { settings, setSettings } = UseSettings();
  const { skills } = settings;

  useEffect(() => {
    if (alert.message && skills) {
      setAlert({ type: "", message: "" });
    }
  }, [skills]);

  function addSkill() {
    const skillInput = skillInputRef.current;
    if (!skillInput) return;
    const rawValue = skillInput.value || "";
    const newSkill = rawValue
      .replace(/\s+/g, " ")
      .replace(/-+/g, "-")
      .replace(/\/+/g, "/")
      .trim();

    const validationError = validateSkillInput({ text: newSkill, skills });
    if (validationError) {
      setAlert(validationError);
      return;
    }

    setSettings((prev) => {
      const newSettings = { ...prev };
      newSettings.skills = [
        ...(newSettings.skills || []),
        regexEndNormalizeSkill(newSkill),
      ];
      return newSettings;
    });

    if (skillInput) {
      skillInput.value = "";
      skillInput.focus();
    }
  }

  function removeSkill(skill) {
    setSettings((prev) => {
      const newSettings = { ...prev };
      newSettings.skills = (newSettings.skills || []).filter(
        (s) => s !== skill,
      );
      return newSettings;
    });
  }

  return (
    <div className="content-container">
      {/* <!-- Page Title --> */}
      <h1 className="text-2xl font-semibold text-center text-gray-900 mb-8">
        Profile
      </h1>

      {/* <!-- Profile Section with Avatar and Name --> */}
      <div className="mb-8">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-300 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-gray-700 font-semibold text-lg">JV</span>
            </div>
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50">
              <svg
                className="w-3 h-3 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Name
            </label>
            <input
              type="text"
              defaultValue="Jan de Vries"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-300 mb-8" />

      {/* Settings Section */}
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>

      {/* Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Address
        </label>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Province</label>
            <input
              type="text"
              defaultValue="Noord-Holland"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">City</label>
            <input
              type="text"
              defaultValue="Amsterdam"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Street</label>
            <input
              type="text"
              defaultValue="Keizersgracht"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              House no.
            </label>
            <input
              type="text"
              defaultValue="123"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Skills */}
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
        <div id="skillsList" ref={skillsListRef}>
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

      {/* <!-- Save Button --> */}
      <div className="flex justify-end mb-8">
        <button className="px-8 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium">
          Save
        </button>
      </div>

      <hr className="border-gray-300 mb-8" />

      {/* <!-- Profile Management Section --> */}
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Profile management
      </h2>

      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">Delete Profile</h3>
          <p className="text-sm text-gray-600">
            Permanently delete your account and data.
          </p>
        </div>
        <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition font-medium">
          Delete Profile
        </button>
      </div>
    </div>
  );
}
