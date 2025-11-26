import { images } from "../assets";
import { regexEndNormalizeSkill } from "../util/regexEndNormalizeSkill";

export const formatAddress = (user) => {
  const parts = [];
  if (user?.street) parts.push(user.street);
  if (user?.housenumber) parts.push(user.housenumber);
  if (user?.city) parts.push(user.city);
  if (user?.country) parts.push(user.country);
  return parts.join(", ");
};

// list of default skill display names
const defaultSkillNames = [
  "Adaptability",
  "Active listening",
  "Attention to detail",
  "Collaboration",
  "Communication",
  "Conflict resolution",
  "Creativity",
  "Critical thinking",
  "Customer Service",
  "Data analysis",
  "Decision making",
  "Digital literacy",
  "Emotional Intelligence",
  "Goal setting",
  "Initiative",
  "Leadership",
  "Negotiation",
  "Problem-solving",
  "Project management",
  "Public speaking",
  "Risk management",
  "Strategic thinking",
  "Teamwork",
  "Technical literacy",
];

export const defaultUser = {
  firstname: "Guest",
  lastname: "User",
  avatar: images.defaultAvatar,
  email: "guest@example.com",

  street: "Keizersgracht",
  housenumber: 123,
  city: "Amsterdam",
  country: "Netherlands",
  skills: defaultSkillNames
    .map((skill) => regexEndNormalizeSkill(skill))
    .sort((a, b) => a.normalizedSkill.localeCompare(b.normalizedSkill)),
  favorites: [],
};
