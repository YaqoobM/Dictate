import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { MeetingSidebar } from "../../page/sidebar";

type Props = {
  sidebar: "meetings" | "teams";
  children: ReactNode;
  setHideJoinMeetingModal?: Dispatch<SetStateAction<boolean>>;
  setHideCreateMeetingModal?: Dispatch<SetStateAction<boolean>>;
};

const Sidebar: FC<Props> = ({
  sidebar,
  children,
  setHideJoinMeetingModal,
  setHideCreateMeetingModal,
}) => {
  if (sidebar === "meetings") {
    return (
      <div className="container mx-auto flex w-full flex-col px-8 py-3 sm:py-4 md:py-5 lg:flex-row">
        <MeetingSidebar
          breakpoint="lg"
          setHideJoinMeetingModal={setHideJoinMeetingModal}
          setHideCreateMeetingModal={setHideCreateMeetingModal}
        />
        <div className="w-full lg:h-full">{children}</div>
      </div>
    );
  } else {
    return children;
  }
};

export default Sidebar;
