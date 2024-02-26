import { FC, ReactNode, useState } from "react";
import { SlidingMenu as MenuIcon } from "../../../assets/icons/buttons";

type Props = {
  breakpoint?: string;
  className?: string;
  children: ReactNode;
};

const Sidebar: FC<Props> = ({ breakpoint = "lg", className, children }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <aside
      className={`flex w-full flex-col ${breakpoint === "lg" ? "lg:inline-flex lg:h-full lg:w-auto lg:flex-row" : ""} ${open ? "mr-10 gap-x-10" : "mr-6 gap-x-6"} ${className}`}
    >
      <div
        className={`mt-2 flex w-max flex-col gap-y-2 ${breakpoint === "lg" ? "lg:my-2 lg:h-full lg:gap-y-4" : ""}`}
      >
        <MenuIcon
          className={`ml-1 w-[24px] cursor-pointer stroke-gray-950 hover:stroke-amber-500 dark:stroke-gray-200 dark:hover:stroke-amber-300`}
          onClick={() => setOpen((prev) => !prev)}
        />
        <div className={`ml-[7px] ${open ? "block" : "hidden"}`}>
          {children}
        </div>
      </div>
      <div
        className={`ml-px h-0.5 w-auto rounded-full bg-gray-400 dark:bg-gray-400/20 ${breakpoint === "lg" ? "lg:my-0 lg:h-auto lg:w-0.5" : ""} ${open ? "mb-3 mt-6" : "mb-2 mt-3"}`}
      />
    </aside>
  );
};

export default Sidebar;
