export default function getSkillsInDescription(
  normalized_description,
  skills = [],
) {
  return skills
    .filter((s) => {
      let re = null;
      if (s.skillRegex instanceof RegExp) re = s.skillRegex;
      return re ? re.test(normalized_description) : false;
    })
    .map((s) => s.skill);
}
