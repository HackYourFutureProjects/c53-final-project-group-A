import { regexEndNormalizeSkill } from "./regexEndNormalizeSkill";

export const fixUserSkills = (skills) => {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) => regexEndNormalizeSkill(skill))
    .sort((a, b) => a.normalizedSkill.localeCompare(b.normalizedSkill));
};
