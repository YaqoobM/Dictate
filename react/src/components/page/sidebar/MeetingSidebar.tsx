import { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar } from ".";

type Props = {
  className?: string;
};

const MeetingSidebar: FC<Props> = ({ className }) => {
  const location = useLocation();

  console.log(location);

  return (
    <Sidebar className={className}>
      <h1>Join Meeting</h1>
      <h1>Create Meeting</h1>
      <div className="my-1 h-px rounded-full bg-gray-400 dark:bg-gray-400/20" />
      <NavLink
        to="/calendars"
        className={({ isActive }) =>
          `hover:text-amber-500 dark:hover:text-amber-300 ${isActive ? "text-amber-500 dark:text-amber-300" : ""}`
        }
      >
        Calendars
      </NavLink>
      <NavLink
        to="/resources"
        className={({ isActive }) =>
          `hover:text-amber-500 dark:hover:text-amber-300 ${isActive ? "text-amber-500 dark:text-amber-300" : ""}`
        }
      >
        Resources
      </NavLink>
    </Sidebar>
  );
};

export default MeetingSidebar;
