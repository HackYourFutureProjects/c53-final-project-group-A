import { images } from "../assets";

export const formatAddress = (address) => {
  return `${address.street} ${address.houseNumber}, ${address.city}, ${address.country}`;
};

export const defaultUser = {
  firstName: "Guest",
  lastName: "User",
  avatar: images.defaultAvatar,
  email: "guest@example.com",
  JWT: "",

  address: {
    street: "Keizersgracht",
    houseNumber: 123,
    city: "Amsterdam",
    country: "Netherlands",
  },
  skills: [
    {
      skill: "Adaptability",
      normalizedSkill: "adaptability",
      skillRegex: { pattern: " adaptability ", flags: "i" },
    },
    {
      skill: "Active listening",
      normalizedSkill: "active listening",
      skillRegex: { pattern: " active listening ", flags: "i" },
    },
    {
      skill: "Attention to detail",
      normalizedSkill: "attention to detail",
      skillRegex: { pattern: " attention to detail ", flags: "i" },
    },
    {
      skill: "Collaboration",
      normalizedSkill: "collaboration",
      skillRegex: { pattern: " collaboration ", flags: "i" },
    },
    {
      skill: "Communication",
      normalizedSkill: "communication",
      skillRegex: { pattern: " communication ", flags: "i" },
    },
    {
      skill: "Conflict resolution",
      normalizedSkill: "conflict resolution",
      skillRegex: { pattern: " conflict resolution ", flags: "i" },
    },
    {
      skill: "Creativity",
      normalizedSkill: "creativity",
      skillRegex: { pattern: " creativity ", flags: "i" },
    },
    {
      skill: "Critical thinking",
      normalizedSkill: "critical thinking",
      skillRegex: { pattern: " critical thinking ", flags: "i" },
    },
    {
      skill: "Customer Service",
      normalizedSkill: "customer service",
      skillRegex: { pattern: " customer service ", flags: "i" },
    },
    {
      skill: "Data analysis",
      normalizedSkill: "data analysis",
      skillRegex: { pattern: " data analysis ", flags: "i" },
    },
    {
      skill: "Decision making",
      normalizedSkill: "decision making",
      skillRegex: { pattern: " decision making ", flags: "i" },
    },
    {
      skill: "Digital literacy",
      normalizedSkill: "digital literacy",
      skillRegex: { pattern: " digital literacy ", flags: "i" },
    },
    {
      skill: "Emotional Intelligence",
      normalizedSkill: "emotional intelligence",
      skillRegex: { pattern: " emotional intelligence ", flags: "i" },
    },
    {
      skill: "Goal setting",
      normalizedSkill: "goal setting",
      skillRegex: { pattern: " goal setting ", flags: "i" },
    },
    {
      skill: "Initiative",
      normalizedSkill: "initiative",
      skillRegex: { pattern: " initiative ", flags: "i" },
    },
    {
      skill: "Leadership",
      normalizedSkill: "leadership",
      skillRegex: { pattern: " leadership ", flags: "i" },
    },
    {
      skill: "Negotiation",
      normalizedSkill: "negotiation",
      skillRegex: { pattern: " negotiation ", flags: "i" },
    },
    {
      skill: "Problem-solving",
      normalizedSkill: "problem solving",
      skillRegex: { pattern: " problem solving ", flags: "i" },
    },
    {
      skill: "Project management",
      normalizedSkill: "project management",
      skillRegex: { pattern: " project management ", flags: "i" },
    },
    {
      skill: "Public speaking",
      normalizedSkill: "public speaking",
      skillRegex: { pattern: " public speaking ", flags: "i" },
    },
    {
      skill: "Risk management",
      normalizedSkill: "risk management",
      skillRegex: { pattern: " risk management ", flags: "i" },
    },
    {
      skill: "Strategic thinking",
      normalizedSkill: "strategic thinking",
      skillRegex: { pattern: " strategic thinking ", flags: "i" },
    },
    {
      skill: "Teamwork",
      normalizedSkill: "teamwork",
      skillRegex: { pattern: " teamwork ", flags: "i" },
    },
    {
      skill: "Technical literacy",
      normalizedSkill: "technical literacy",
      skillRegex: { pattern: " technical literacy ", flags: "i" },
    },
  ],
  favorites: [],
};
