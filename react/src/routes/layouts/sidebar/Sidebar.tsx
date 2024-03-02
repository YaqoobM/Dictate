import { FC } from "react";
import { Outlet } from "react-router-dom";
import { MeetingSidebar } from "../../../components/page";

type Props = {
  sidebar: "meetings" | "teams";
};

const Sidebar: FC<Props> = ({ sidebar }) => {
  if (sidebar === "meetings") {
    return (
      <div className="container mx-auto flex w-full flex-col px-8 py-3 sm:py-4 md:py-5 lg:flex-row">
        <MeetingSidebar breakpoint="lg" />
        <div className="w-full lg:h-full">
          <Outlet />
        </div>
      </div>
    );
  } else {
    // else if (sidebar === "teams")
    return (
      <div className="container mx-auto flex w-full flex-col px-8 py-3 sm:py-4 md:py-5 lg:flex-row">
        <MeetingSidebar breakpoint="lg" />
        {/* TeemSidebar */}
        <div className="w-full lg:h-full">
          <Outlet />
        </div>
      </div>
    );
  }
};

export default Sidebar;
