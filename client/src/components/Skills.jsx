import { useAuth } from "../context/AuthContext";

function normalizeDescription(str) {
  return " " + str.replace(/[^A-Za-z0-9+#]/g, " ").replace(/ +/g, " ") + " ";
}

function getSkillsInDescription(text, skills = []) {
  const textSpaced = normalizeDescription(text);
  return skills
    .filter((s) => {
      let re = null;
      if (s.skillRegex instanceof RegExp) re = s.skillRegex;
      return re ? re.test(textSpaced) : false;
    })
    .map((s) => s.skill);
}

export default function Skills({ item }) {
  const { user } = useAuth();
  // user may be undefined during initial render; default to empty array
  const skills = user?.skills || [];

  const skillsInDescription = getSkillsInDescription(
    item.description_text || "",
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
