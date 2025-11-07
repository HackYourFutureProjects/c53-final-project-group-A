import { createContext, useContext, useState } from "react";
import { defaultUser } from "../data/defaultUser";
import { mapSkillToRegex } from "../util/mapSkillToRegex";

const initialSettings = {
  address: defaultUser.address,
  skills: defaultUser.skills.map((skill) => mapSkillToRegex(skill)),
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
