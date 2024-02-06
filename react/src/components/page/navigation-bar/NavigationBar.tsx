import { FC, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu as MenuButton } from "../../../assets/icons";
import { ThemeContext } from "../../../utils/contexts";

const NavigationBar: FC = () => {
  const { currentTheme, changeCurrentTheme } = useContext(ThemeContext);
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    if (toggleMenu === true) {
      setToggleMenu(false);
    }
  }, [location]);

  let backgroundColor: string =
    "bg-gray-800 bg-gradient-to-r from-gray-100 to-gray-200/95 dark:from-gray-800 dark:bg-gray-500 dark:to-gray-900";

  let linkColor: string = "hover:text-amber-600 hover:dark:text-amber-300";

  return (
    <nav
      className={`relative z-[1] flex flex-row items-center justify-between justify-items-center px-8 py-3 text-gray-950 shadow-xl dark:text-gray-200 ${backgroundColor}`}
    >
      <Link to="/home" className="text-3xl font-medium">
        Dictate
      </Link>
      <MenuButton
        className={`peer hover:cursor-pointer md:hidden ${toggleMenu ? "clicked" : ""}`}
        strokeColor={
          currentTheme === "dark" ? "rgb(229, 231, 235)" : "rgb(31, 41, 55)"
        }
        onClick={() => setToggleMenu((prev) => !prev)}
      />
      <span
        className={`group hidden items-center justify-items-center gap-x-8 gap-y-2 peer-[.clicked]:absolute peer-[.clicked]:left-0 peer-[.clicked]:top-full peer-[.clicked]:flex peer-[.clicked]:w-screen peer-[.clicked]:flex-col peer-[.clicked]:pb-4 md:!static md:flex md:!w-fit md:!flex-row md:!bg-transparent md:!bg-none md:!pb-0 ${toggleMenu ? backgroundColor + " clicked" : ""}`}
      >
        <span className="flex items-center justify-items-center gap-x-10 gap-y-2 border-current group-[.clicked]:flex-col group-[.clicked]:border-r-0 group-[.clicked]:pr-0 md:!flex-row md:!border-r md:!pr-8">
          <Link className={`${linkColor}`} to="/login">
            Login
          </Link>
          <Link className={`${linkColor}`} to="/signup">
            Sign Up
          </Link>
        </span>
        <button
          onClick={() =>
            changeCurrentTheme(currentTheme === "dark" ? "light" : "dark")
          }
          className={`border-b border-current ${linkColor}`}
        >
          {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </span>
    </nav>
  );
};

export default NavigationBar;
