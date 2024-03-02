import { FC, ReactNode, useRef, useState } from "react";
import { SlidingMenu as MenuIcon } from "../../../assets/icons/buttons";

type Props = {
  breakpoint?: string;
  className?: string;
  modals?: ReactNode;
  children: ReactNode;
};

const Sidebar: FC<Props> = ({
  breakpoint = "lg",
  className,
  modals,
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <aside
        className={`flex w-full flex-col transition-all ${breakpoint === "lg" ? "lg:inline-flex lg:h-full lg:w-auto lg:flex-row" : ""} ${open ? "mr-10 gap-x-10" : "mr-6 gap-x-6"} ${className}`}
      >
        <div
          className={`mt-2 flex flex-col gap-y-2 overflow-hidden transition-all max-lg:!w-max lg:!h-max ${breakpoint === "lg" ? "lg:my-2 lg:h-full lg:gap-y-4" : ""}`}
          style={{
            width: open
              ? `calc(${contentRef.current?.offsetWidth}px + 7px)`
              : "28px",
            height: open
              ? `calc(${contentRef.current?.offsetHeight}px + 32px)`
              : "24px",
          }}
        >
          <MenuIcon
            className={`ml-1 w-[24px] shrink-0 cursor-pointer stroke-gray-950 hover:stroke-amber-500 dark:stroke-gray-200 dark:hover:stroke-amber-300`}
            onClick={() => setOpen((prev) => !prev)}
          />
          <div
            className={`relative left-0 ml-[7px] w-max transition-all ${open ? "translate-x-0" : "lg:-translate-x-[110%]"}`}
            ref={contentRef}
          >
            {children}
          </div>
        </div>
        <div
          className={`ml-px h-0.5 w-auto rounded-full bg-gray-400 dark:bg-gray-400/20 ${breakpoint === "lg" ? "lg:my-0 lg:h-auto lg:w-0.5" : ""} ${open ? "mb-3 mt-6" : "mb-2 mt-3"}`}
        />
      </aside>

      {modals}
    </>
  );
};

export default Sidebar;
