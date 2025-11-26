import { regexEndNormalizeSkill } from "./regexEndNormalizeSkill";

export const fixUserSkills = (skills) => {
  // Accept either an array of skill strings or a comma-separated skills string
  let arr = [];
  if (Array.isArray(skills)) {
    arr = skills;
  } else if (typeof skills === "string" && skills.trim() !== "") {
    arr = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    return [];
  }

  return arr
    .map((skill) => regexEndNormalizeSkill(skill))
    .sort((a, b) => a.normalizedSkill.localeCompare(b.normalizedSkill));
};
