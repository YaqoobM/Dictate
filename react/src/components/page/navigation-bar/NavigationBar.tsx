import { FC } from "react";

const NavigationBar: FC = () => {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="flex flex-row items-center justify-between justify-items-center bg-green-300 px-4 py-2">
      <h1 className="text-3xl font-bold text-gray-100 first-letter:text-sky-500">
        Dictate
      </h1>
      <button onClick={toggleDarkMode} className="bg-sky-500 px-4 py-2">
        Dark Mode
      </button>
    </nav>
  );
};

export default NavigationBar;
