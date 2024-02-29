import { Dispatch, FC, SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import { Sidebar } from ".";

type Props = {
  setHideJoinMeetingModal?: Dispatch<SetStateAction<boolean>>;
  setHideCreateMeetingModal?: Dispatch<SetStateAction<boolean>>;
  breakpoint?: string;
  className?: string;
};

const MeetingSidebar: FC<Props> = ({
  setHideJoinMeetingModal,
  setHideCreateMeetingModal,
  ...props
}) => {
  return (
    <Sidebar {...props}>
      <div className="flex flex-col gap-y-[10px]">
        <div className="flex flex-col">
          <h1 className="mt-1 text-xs font-medium uppercase">take a look</h1>
          <NavLink
            to="/calendars"
            className={({ isActive }) =>
              `mt-2 border-l-2 border-gray-400 py-0.5 pl-4 text-sm hover:!border-amber-500/90 hover:text-amber-500 dark:border-gray-400/20 dark:hover:!border-amber-300/90 dark:hover:text-amber-300 ${isActive ? "text-amber-500 dark:text-amber-300" : ""}`
            }
          >
            Calendars
          </NavLink>
          <div className="h-1.5 w-full border-l-2 border-gray-400 dark:border-gray-400/20" />
          <NavLink
            to="/resources"
            className={({ isActive }) =>
              `border-l-2 border-gray-400 py-0.5 pl-4 text-sm hover:!border-amber-500/90 hover:text-amber-500 dark:border-gray-400/20 dark:hover:!border-amber-300/90 dark:hover:text-amber-300 ${isActive ? "text-amber-500 dark:text-amber-300" : ""}`
            }
          >
            Resources
          </NavLink>
        </div>
        <div className="flex flex-col">
          <h1 className="mt-5 text-xs font-medium uppercase">try</h1>
          <h2
            className="mt-2 cursor-pointer border-l-2 border-gray-400 py-0.5 pl-4 text-sm hover:!border-amber-500/90 hover:text-amber-500 dark:border-gray-400/20 dark:hover:!border-amber-300/90 dark:hover:text-amber-300"
            onClick={() =>
              setHideJoinMeetingModal ? setHideJoinMeetingModal(false) : null
            }
          >
            Join Meeting
          </h2>
          <div className="h-1.5 w-full border-l-2 border-gray-400 dark:border-gray-400/20" />
          <h2
            className="cursor-pointer border-l-2 border-gray-400 py-0.5 pl-4 text-sm hover:!border-amber-500/90 hover:text-amber-500 dark:border-gray-400/20 dark:hover:!border-amber-300/90 dark:hover:text-amber-300"
            onClick={() =>
              setHideCreateMeetingModal
                ? setHideCreateMeetingModal(false)
                : null
            }
          >
            Create Meeting
          </h2>
        </div>
      </div>
    </Sidebar>
  );
};

export default MeetingSidebar;
