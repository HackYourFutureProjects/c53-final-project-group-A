export function regexEndNormalizeSkill(skill) {
  let escaped = skill;
  let normalizedSkill = skill;
  escaped = escaped.replace(/[.*+?^${}()|[\]\\#]/g, "\\$&");
  const skillRegex = new RegExp(" " + escaped + " ", "i");
  normalizedSkill = normalizedSkill.replace(/[-/\s]/g, " ");
  return { skill, skillRegex, normalizedSkill };
}
