import { FC, ReactNode, useEffect, useState } from "react";
import { ThemeContext } from ".";

type Props = {
  children: ReactNode;
};

const ThemeContextWrapper: FC<Props> = ({ children }) => {
  const persistedTheme: string | null = localStorage.getItem("theme");
  const [theme, setTheme] = useState(persistedTheme || "light");

  const toggleTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextWrapper;
