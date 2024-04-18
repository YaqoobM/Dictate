import { Dispatch, FC, SetStateAction } from "react";
import { useCalendar, useGetSuffix } from "../../../../hooks/calendar";
import { Meeting } from "../../../../types";

interface Day {
  day: number;
  month: number;
  year: number;
  disabled?: boolean;
}

interface ExtraInfoDay extends Day {
  hasMeetings: boolean;
  hasTeamMeetings: boolean;
  hasOngoingMeetings: boolean;
  hasOngoingTeamMeetings: boolean;
}

type SortedMeetings = {
  month: number;
  year: number;
  meetings: Meeting[];
};

type Props = {
  date: Date;
  meetings: SortedMeetings[];
  selectedDay: Date | null;
  setSelectedDay: Dispatch<SetStateAction<Date | null>>;
  className?: string;
};

const Calendar: FC<Props> = ({
  date,
  meetings,
  selectedDay,
  setSelectedDay,
  className,
}) => {
  const calendar: Day[] = useCalendar(date);

  const today = new Date();
  const loadedCalendar = calendar.reduce<ExtraInfoDay[]>(
    (accumulator, { day, month, year, disabled }) => {
      let hasMeetings = false;
      let hasTeamMeetings = false;
      let hasOngoingMeetings = false;
      let hasOngoingTeamMeetings = false;

      let filteredMeetings = meetings.find(
        (sortedMeeting) =>
          sortedMeeting.year === year && sortedMeeting.month === month,
      )?.meetings;

      for (const meeting of filteredMeetings || []) {
        if (parseInt(meeting.start_time.split(" ")[0].split("/")[0]) === day) {
          if (meeting.team) {
            hasTeamMeetings = true;
          } else {
            hasMeetings = true;
          }

          if (!meeting.end_time) {
            if (meeting.team) {
              hasOngoingTeamMeetings = true;
            } else {
              hasOngoingMeetings = true;
            }
          }
        }
      }

      return [
        ...accumulator,
        {
          day,
          month,
          year,
          disabled,
          hasMeetings,
          hasTeamMeetings,
          hasOngoingMeetings,
          hasOngoingTeamMeetings,
        },
      ];
    },
    [],
  );

  const isToday: (day: Day, comparison?: Date) => boolean = (
    day,
    comparison = today,
  ) => {
    if (
      day.day === comparison.getDate() &&
      day.month === comparison.getMonth() &&
      day.year === comparison.getFullYear()
    ) {
      return true;
    }

    return false;
  };

  const handleClick = (day: Day) => {
    setSelectedDay((prev) => {
      if (
        prev &&
        prev.getFullYear() === day.year &&
        prev.getMonth() === day.month &&
        prev.getDate() === day.day
      ) {
        return null;
      }
      return new Date(day.year, day.month, day.day);
    });
  };

  return (
    <section className={`${className}`}>
      <div className="mb-1 grid grid-cols-7 items-center justify-items-center gap-x-3">
        <h1 className="text-xs sm:text-base">Sunday</h1>
        <h1 className="text-xs sm:text-base">Monday</h1>
        <h1 className="text-xs sm:text-base">Tuesday</h1>
        <h1 className="text-xs sm:text-base">Wednesday</h1>
        <h1 className="text-xs sm:text-base">Thursday</h1>
        <h1 className="text-xs sm:text-base">Friday</h1>
        <h1 className="text-xs sm:text-base">Saturday</h1>
      </div>
      <div className="grid grid-cols-7 items-center justify-items-center gap-1 text-center sm:gap-2">
        {loadedCalendar.map((day) => (
          <div
            className={`relative w-full cursor-pointer rounded-md border-2 border-transparent pt-[120%] shadow-sm transition-transform hover:scale-105 hover:border-amber-500 hover:dark:border-amber-300 ${isToday(day) ? "bg-amber-500/60 dark:bg-amber-300/60" : "bg-gray-200 dark:bg-gray-900"} ${selectedDay && isToday(day, selectedDay) ? "!border-blue-500 dark:!border-blue-400" : ""} ${day.disabled ? "opacity-50" : ""}`}
            onClick={() => handleClick(day)}
            key={`${day.day}/${day.month}/${day.year}`}
          >
            <p className="absolute left-2 top-2 text-xs font-medium uppercase sm:text-sm">
              {day.day}
              {useGetSuffix(day.day)}
            </p>
            <p
              className={`absolute bottom-2 right-2 aspect-square w-[12.5%] rounded-full ${day.hasMeetings ? "bg-blue-500 dark:bg-blue-400" : day.hasTeamMeetings ? "bg-amber-500 dark:bg-amber-300" : "hidden"} ${day.hasOngoingMeetings || day.hasOngoingTeamMeetings ? "animate-pulse" : null}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Calendar;
