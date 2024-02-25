import { FC, ReactNode, useState } from "react";
import { SlidingMenu as MenuIcon } from "../../../assets/icons/buttons";

type Props = {
  className?: string;
  children: ReactNode;
};

const Sidebar: FC<Props> = ({ className, children }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <aside
      className={`inline-flex flex-row ${open ? "mr-4 gap-x-4" : "mr-3 gap-x-2"} ${className}`}
    >
      <div className="flex h-full flex-col gap-y-2">
        <MenuIcon
          className="ml-1 w-[24px] cursor-pointer stroke-gray-950 dark:stroke-gray-200"
          onClick={() => setOpen((prev) => !prev)}
        />
        <div
          className={`ml-[7px] flex-col gap-y-2 ${open ? "flex" : "hidden"}`}
        >
          {children}
        </div>
      </div>
      <div className="ml-px w-px rounded-full bg-gray-400 dark:bg-gray-400/20" />
    </aside>
  );
};

export default Sidebar;
