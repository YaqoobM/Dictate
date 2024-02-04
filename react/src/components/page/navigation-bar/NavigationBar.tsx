import { FC, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../utils/contexts";

const NavigationBar: FC = () => {
  const { currentTheme, changeCurrentTheme } = useContext(ThemeContext);

  return (
    <nav className="relative z-[1] flex flex-row items-center justify-between justify-items-center bg-gray-800 bg-gradient-to-r from-gray-100 to-gray-200/95 px-8 py-3 text-gray-800 shadow-xl dark:bg-gray-500 dark:from-gray-800 dark:to-gray-800/95 dark:text-gray-200">
      <Link to="/home" className="text-3xl font-medium tracking-wide">
        Dictate
      </Link>
      <span className="flex flex-row items-center justify-items-center gap-x-8">
        <span className="flex flex-row items-center justify-items-center gap-x-10 border-r-2 border-current pr-8">
          <Link
            className="font-semibold hover:text-amber-500 hover:dark:text-amber-300"
            to="/login"
          >
            Login
          </Link>
          <Link
            className="font-semibold hover:text-amber-500 hover:dark:text-amber-300"
            to="/signup"
          >
            Sign Up
          </Link>
        </span>
        <button
          onClick={() =>
            changeCurrentTheme(currentTheme === "dark" ? "light" : "dark")
          }
          className="border-b-2 border-current font-semibold shadow-sm hover:text-amber-500 hover:dark:text-amber-300"
        >
          {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </span>
    </nav>
  );
};

export default NavigationBar;
