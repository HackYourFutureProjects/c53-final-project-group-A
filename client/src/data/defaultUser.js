import { images } from "../assets";
import { regexEndNormalizeSkill } from "../util/regexEndNormalizeSkill";

export const formatAddress = (address) => {
  const parts = [];
  if (address?.street) parts.push(address.street);
  if (address?.housenumber) parts.push(address.housenumber);
  if (address?.city) parts.push(address.city);
  if (address?.country) parts.push(address.country);
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

  address: {
    street: "Keizersgracht",
    housenumber: 123,
    city: "Amsterdam",
    country: "Netherlands",
  },
  skills: defaultSkillNames
    .map((skill) => regexEndNormalizeSkill(skill))
    .sort((a, b) => a.normalizedSkill.localeCompare(b.normalizedSkill)),
  favorites: [],
};
