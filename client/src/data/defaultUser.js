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
    "Communication",
    "Adaptability",
    "Teamwork",
    "Project management",
    "Risk management",
    "Leadership",
    "Data analysis",
    "Collaboration",
    "Creativity",
    "Emotional Intelligence",
    "Critical thinking",
    "Strategic thinking",
    "Attention to detail",
    "Decision making",
    "Goal setting",
    "Initiative",
    "Active listening",
    "Digital literacy",
    "Technical literacy",
    "Negotiation",
    "Problem-solving",
    "Conflict resolution",
    "Customer Service",
    "Public speaking",
  ],
  favorites: [],
};
