import { UseUser } from "../context/UserContext";

export default function Skills({ job }) {
  const { user } = UseUser();
  const skills = user?.skills || [];

  return (
    <div className="flex gap-2">
      <span className="text-sm font-medium mr-2">
        Skills Match ({job?.skillsMatch}/{skills.length}):
      </span>
      {job?.skillsInDescription?.map((skill) => (
        <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded">
          {skill}
        </span>
      ))}
    </div>
  );
}
