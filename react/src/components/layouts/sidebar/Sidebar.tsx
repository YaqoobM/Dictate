import { FC, ReactNode } from "react";
import { MeetingSidebar } from "../../page/sidebar";

type Props = {
  sidebar: "meetings" | "teams";
  children: ReactNode;
};

const Sidebar: FC<Props> = ({ sidebar, children }) => {
  if (sidebar === "meetings") {
    return (
      <div className="container mx-auto flex w-full flex-col px-8 py-3 sm:py-4 md:py-5 lg:flex-row">
        <MeetingSidebar breakpoint="lg" />
        <div className="w-full lg:h-full">{children}</div>
      </div>
    );
  } else {
    return children;
  }
};

export default Sidebar;
