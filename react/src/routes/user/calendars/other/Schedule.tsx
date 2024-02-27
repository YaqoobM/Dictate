import { FC } from "react";
import { Meeting } from "../../../../types";

type SortedMeetings = {
  month: number;
  year: number;
  meetings: Meeting[];
};

type Props = {
  day: Date | null;
  meetings: SortedMeetings[];
};

const Schedule: FC<Props> = ({ day, meetings }) => {
  return <div>{!day ? "PLEASE SELECT DAY" : day.toDateString()}</div>;
};

export default Schedule;
