import { useEffect, useRef } from "react";

export default function UserProfile() {
  const skillInputRef = useRef(null);
  const addSkillBtnRef = useRef(null);
  const skillsListRef = useRef(null);

  let skills = [
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Docker",
    "AWS",
  ];

  // Initialize with existing skills
  function initializeSkills() {
    skills.forEach((skill) => {
      addSkillToDOM(skill);
    });
  }

  // Add skill to DOM
  function addSkillToDOM(skill) {
    const skillElement = document.createElement("div");
    skillElement.className =
      "inline-flex items-center bg-white border border-gray-300 rounded px-3 py-1.5 text-sm";
    skillElement.innerHTML = `
                <span class="text-gray-800 mr-2">${skill}</span>
                <button class="text-gray-500 hover:text-red-600 transition" onclick="removeSkill('${skill}', this)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            `;
    const list = skillsListRef.current;
    if (list) list.appendChild(skillElement);
  }

  // Add skill function
  function addSkill() {
    const input = skillInputRef.current;
    const skill = input ? input.value.trim() : "";

    if (skill === "") return;

    // Check if skill already exists
    if (skills.includes(skill)) {
      alert("This skill is already added!");
      return;
    }

    // Add to array
    skills.push(skill);

    // Add to DOM
    addSkillToDOM(skill);

    // Clear input
    if (input) {
      input.value = "";
      input.focus();
    }
  }

  // Remove skill function is attached to window in useEffect (after mount)

  // Attach listeners after mount
  useEffect(() => {
    // expose removeSkill on window for the inline onclick in innerHTML
    window.removeSkill = function (skill, button) {
      // Remove from array
      skills = skills.filter((s) => s !== skill);

      // Remove from DOM
      if (button && button.parentElement) button.parentElement.remove();
    };
    const addSkillBtn = addSkillBtnRef.current;
    const input = skillInputRef.current;

    function handleKeypress(e) {
      if (e.key === "Enter") addSkill();
    }

    if (addSkillBtn) addSkillBtn.addEventListener("click", addSkill);
    if (input) input.addEventListener("keypress", handleKeypress);

    // Initialize skills on mount
    initializeSkills();

    return () => {
      if (addSkillBtn) addSkillBtn.removeEventListener("click", addSkill);
      if (input) input.removeEventListener("keypress", handleKeypress);
    };
  }, []);

  return (
    <>
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
              value="Jan de Vries"
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
              value="Noord-Holland"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">City</label>
            <input
              type="text"
              value="Amsterdam"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Street</label>
            <input
              type="text"
              value="Keizersgracht"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              House no.
            </label>
            <input
              type="text"
              value="123"
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
          />
          <button
            id="addSkillBtn"
            ref={addSkillBtnRef}
            className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>

        {/* Skills List */}
        <div
          id="skillsList"
          ref={skillsListRef}
          className="flex flex-wrap gap-2 min-h-[60px] border border-gray-300 rounded p-3 bg-gray-50"
        ></div>
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
    </>
  );
}
