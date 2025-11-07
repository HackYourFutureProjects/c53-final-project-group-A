import { defaultUser } from "../data/defaultUser";
import { useMemo } from "react";

function normalizeDescription(str) {
  return " " + str.replace(/ +/g, " ").replace(/[^A-Za-z0-9+#]/g, " ") + " ";
}
function normalizeSkills(skill) {
  let skillTrimmed = "";
  if (typeof skill === "string") {
    skillTrimmed = skill.replace(/[-/\s]/g, " ");
  }
  return skillTrimmed;
}
function escapeForRegex(skill) {
  return skill.replace(/[.*+?^${}()|[\]\\#]/g, "\\$&");
}

function getSkillsInDescription(text, skillRegexes, defaultUser) {
  const textSpaced = normalizeDescription(text);
  if (defaultUser.skills && defaultUser.skills.length > 0) {
    const skills = [...defaultUser.skills].map((skill) =>
      normalizeSkills(skill),
    );
    return skills.filter((skill) => {
      const re = skillRegexes.get(skill);
      return re ? re.test(textSpaced) : false;
    });
  }
}

export default function Skills({ item }) {
  const { skills, skillRegexes } = useMemo(() => {
    const skillsList = Array.isArray(defaultUser.skills)
      ? defaultUser.skills.map((s) => normalizeSkills(s)).filter(Boolean)
      : [];
    const map = new Map();
    skillsList.forEach((skill) => {
      const escaped = escapeForRegex(skill);
      map.set(skill, new RegExp(" " + escaped + " ", "i"));
    });
    return { skills: skillsList, skillRegexes: map };
  }, [defaultUser.skills]);
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
