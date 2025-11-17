import { images } from "../assets";
import { regexEndNormalizeSkill } from "../util/regexEndNormalizeSkill";

export const formatAddress = (address) => {
  return `${address.street} ${address.housenumber}, ${address.city}, ${address.country}`;
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
  JWT: "",

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
