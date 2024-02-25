import { FC, ReactNode } from "react";
import { MeetingSidebar } from "../../page/sidebar";

type Props = {
  sidebar: "meetings" | "teams";
  children: ReactNode;
};

const Sidebar: FC<Props> = ({ sidebar, children }) => {
  if (sidebar === "meetings") {
    return (
      <div className="container mx-auto h-full w-full px-8 py-1 sm:py-2 md:py-3">
        <MeetingSidebar className="h-full align-top" />
        <div className="inline-block h-full align-top">{children}</div>
      </div>
    );
  } else {
    return children;
  }
};

export default Sidebar;
