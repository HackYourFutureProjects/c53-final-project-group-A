import { defaultUser } from "../data/defaultUser";
import { useMemo } from "react";
// Description of the future job skill input validation:
// Allowed characters are letters, digits, -, /, +, and #.

function normalizeForWordSearch(str) {
  return (" " + str + " ")
    .replace(/[^A-Za-z0-9-/+#]+/g, " ")
    .replace(/\s+/g, " ");
}
function getSkillsInDescription(text, skillRegexes, defaultUser) {
  const textSpaced = normalizeForWordSearch(text);
  if (defaultUser.skills && defaultUser.skills.length > 0) {
    const skills = [...defaultUser.skills].map((skill) =>
      skill.replace(/[^A-Za-z0-9-/+#]+/g, " "),
    );
    return skills.filter((skill) => {
      const re = skillRegexes.get(skill);
      return re ? re.test(textSpaced) : false;
    });
  }
}

export default function Skills({ item }) {
  const skills = defaultUser.skills;
  const skillRegexes = useMemo(() => {
    const map = new Map();
    const escapeForRegex = (s) => s.replace(/[.*+?^${}()|[\]\\#]/g, "\\$&");
    skills.forEach((skill) => {
      const escaped = escapeForRegex(skill);
      map.set(skill, new RegExp(" " + escaped + " ", "i"));
    });
    return map;
  }, [skills]);
  const skillsInDescription = getSkillsInDescription(
    item.descriptionText || "",
    skillRegexes,
    defaultUser,
  );

  return (
    <div className="flex gap-2">
      <span className="text-sm font-medium mr-2">
        Skills Match ({skillsInDescription.length}/{skills.length}):
      </span>
      {skillsInDescription.map((skill) => (
        <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded">
          {skill}
        </span>
      ))}
    </div>
  );
}
