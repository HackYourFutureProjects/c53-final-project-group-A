import { UseSettings } from "../context/SettingsContext";

function normalizeDescription(str) {
  return " " + str.replace(/ +/g, " ").replace(/[^A-Za-z0-9+#]/g, " ") + " ";
}

function getSkillsInDescription(text, skills = []) {
  const textSpaced = normalizeDescription(text);
  return skills
    .filter((skill) => {
      const re = skill.skillRegex;
      return re ? re.test(textSpaced) : false;
    })
    .map((skill) => skill.skill);
}

export default function Skills({ item }) {
  const { settings } = UseSettings();
  const { skills } = settings;

  const skillsInDescription = getSkillsInDescription(
    item.descriptionText || "",
    skills,
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
