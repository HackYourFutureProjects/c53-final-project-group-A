export function mapSkillToRegex(skill) {
  let escaped = skill;
  escaped = escaped.replace(/[.*+?^${}()|[\]\\#]/g, "\\$&");
  const skillRegex = new RegExp(" " + escaped + " ", "i");
  return { skill, skillRegex };
}
