import { createContext, useContext, useState } from "react";
import { defaultUser } from "../data/defaultUser";
import { regexEndNormalizeSkill } from "../util/regexEndNormalizeSkill";

const initialSettings = {
  address: defaultUser.address,
  skills: defaultUser.skills
    .map((skill) => regexEndNormalizeSkill(skill))
    .sort((a, b) =>
      String(a?.normalizedSkill ?? "").localeCompare(
        String(b?.normalizedSkill ?? ""),
      ),
    ),
};
const SettingsContext = createContext();
function UseSettings() {
  return useContext(SettingsContext);
}

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(initialSettings);
  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider, UseSettings };
