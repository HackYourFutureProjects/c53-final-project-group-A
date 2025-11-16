import { images } from "../assets";
import { regexEndNormalizeSkill } from "../util/regexEndNormalizeSkill";

export const formatAddress = (address) => {
  return `${address.street} ${address.houseNumber}, ${address.city}, ${address.country}`;
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
    houseNumber: 123,
    city: "Amsterdam",
    country: "Netherlands",
  },
  skills: defaultSkillNames.map((name) => {
    const { skillRegex, normalizedSkill } = regexEndNormalizeSkill(name);
    return { skill: name, normalizedSkill, skillRegex };
  }),
  favorites: [],
};
