import { FC, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Menu as MenuButton,
} from "../../../assets/icons";
import { ThemeContext } from "../../../utils/contexts";

const NavigationBar: FC = () => {
  const { currentTheme, changeCurrentTheme } = useContext(ThemeContext);
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const location = useLocation();

  const toggleTheme = () => {
    changeCurrentTheme(currentTheme === "dark" ? "light" : "dark");
    setToggleMenu(false);
  };

  useEffect(() => {
    if (toggleMenu === true) {
      setToggleMenu(false);
    }
  }, [location]);

  let backgroundColor: string =
    "bg-gray-800 bg-gradient-to-r from-gray-100 to-gray-200/95 dark:from-gray-800 dark:bg-gray-500 dark:to-gray-900";

  return (
    <nav
      className={`relative z-20 flex flex-row items-center justify-between px-8 py-3 text-gray-950 shadow dark:text-gray-200 dark:shadow-lg ${backgroundColor}`}
    >
      <Link to="/home" className="text-3xl font-medium">
        Dictate
      </Link>
      <span className="flex flex-row justify-between gap-x-4">
        <MenuButton
          width="24"
          className={`peer stroke-gray-950 hover:cursor-pointer dark:stroke-gray-200 lg:hidden ${toggleMenu ? "clicked" : ""}`}
          onClick={() => setToggleMenu((prev) => !prev)}
        />
        <span
          className={`hidden items-center gap-x-8 gap-y-2 peer-[.clicked]:absolute peer-[.clicked]:left-0 peer-[.clicked]:top-full peer-[.clicked]:z-10 peer-[.clicked]:flex peer-[.clicked]:w-screen peer-[.clicked]:flex-col peer-[.clicked]:pb-4 peer-[.clicked]:shadow-xl lg:!static lg:flex lg:!w-fit lg:!flex-row lg:!bg-transparent lg:!bg-none lg:!pb-0 lg:!shadow-none ${toggleMenu ? backgroundColor : ""}`}
        >
          <Link
            className="font-medium hover:text-amber-500 hover:dark:text-amber-300"
            to="/login"
          >
            Login
          </Link>
          <Link
            className="font-medium hover:text-amber-500 hover:dark:text-amber-300"
            to="/signup"
          >
            Sign Up
          </Link>
        </span>
        <div className="ml-px w-px rounded-full bg-gray-400 dark:w-px dark:bg-gray-400/20" />
        {currentTheme === "dark" ? (
          <DarkModeIcon
            width="15"
            className="mx-2 my-1 cursor-pointer stroke-amber-400 dark:stroke-amber-300"
            onClick={toggleTheme}
          />
        ) : (
          <LightModeIcon
            width="30"
            className="cursor-pointer stroke-amber-400 dark:stroke-amber-300"
            onClick={toggleTheme}
          />
        )}
      </span>
    </nav>
  );
};

export default NavigationBar;