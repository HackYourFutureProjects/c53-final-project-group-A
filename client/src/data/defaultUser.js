import { defaultSkills } from "./skills";
import { images } from "../assets";

export const guestUser = {
  name: "Guest",
  avatar: images.defaultAvatar,
  skills: defaultSkills,
  isAuthenticated: false,
  isRegistered: false,
};
