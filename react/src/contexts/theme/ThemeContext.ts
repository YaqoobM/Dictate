import { createContext } from "react";

const defaultValue = {
  theme: "light",
  toggleTheme: (newTheme: "light" | "dark") => {
    console.log("changing theme to " + newTheme);
  },
};

const ThemeContext = createContext(defaultValue);

export default ThemeContext;
