import { UseUser } from "../context/UserContext";

function getSkillsInDescription(normalized_description, skills = []) {
  return skills
    .filter((s) => {
      let re = null;
      if (s.skillRegex instanceof RegExp) re = s.skillRegex;
      return re ? re.test(normalized_description) : false;
    })
    .map((s) => s.skill);
}

export default function Skills({ item }) {
  const { user } = UseUser();
  // user may be undefined during initial render; default to empty array
  const skills = user?.skills || [];

  const skillsInDescription = getSkillsInDescription(
    item.normalized_description || "",
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
