import { defaultUser } from "../data/defaultUser";
import { useMemo } from "react";

function normalizeForWordSearch(str) {
  // replace any other non-word characters with spaces so skills are surrounded by spaces
  return (" " + str + " ").replace(/[^\w+#\\|]+/g, " ").replace(/\s+/g, " ");
}
function getSkillsInDescription(text, skillRegexes, defaultUser) {
  const textSpaced = normalizeForWordSearch(text);
  const skills = defaultUser.skills;
  return skills.filter((skill) => {
    const re = skillRegexes.get(skill);
    return re ? re.test(textSpaced) : false;
  });
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
