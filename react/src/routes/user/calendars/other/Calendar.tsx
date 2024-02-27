import { Dispatch, FC, SetStateAction } from "react";
import { useCalendar } from "../../../../hooks/utils";
import { Meeting } from "../../../../types";

type Day = {
  day: number;
  month: number;
  year: number;
  disabled?: boolean;
};

type SortedMeetings = {
  month: number;
  year: number;
  meetings: Meeting[];
};

type Props = {
  date: Date;
  meetings: SortedMeetings[];
  setSelectedDay: Dispatch<SetStateAction<Date | null>>;
  className?: string;
};

const Calendar: FC<Props> = ({ date, meetings, setSelectedDay, className }) => {
  const calendar: Day[] = useCalendar(date);

  const isToday: (day: Day) => boolean = (day) => {
    let today = new Date();

    if (
      day.day === today.getDate() &&
      day.month === today.getMonth() &&
      day.year === today.getFullYear()
    ) {
      return true;
    }

    return false;
  };

  const getSuffix: (dayOfMonth: number) => string = (i) => {
    let j = i % 10;
    let k = i % 100;
    if (j === 1 && k !== 11) {
      return "st";
    }
    if (j === 2 && k !== 12) {
      return "nd";
    }
    if (j === 3 && k !== 13) {
      return "rd";
    }
    return "th";
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
        {calendar.map((day, i) => (
          <div
            className={`group relative w-full cursor-pointer rounded-md border-2 border-transparent pt-[120%] shadow-sm hover:border-amber-500 hover:dark:border-amber-300 ${isToday(day) ? "bg-amber-500/60 dark:bg-amber-300/60" : "bg-gray-200 dark:bg-gray-900"} ${day.disabled ? "opacity-50" : ""}`}
            onClick={() =>
              setSelectedDay(new Date(day.year, day.month, day.day))
            }
            key={i}
          >
            <p
              className={`absolute left-2 top-2 text-xs font-medium uppercase group-hover:text-amber-500 group-hover:dark:text-amber-300 sm:text-sm ${isToday(day) ? "group-hover:text-gray-100" : ""}`}
            >
              {day.day}
              {getSuffix(day.day)}
            </p>
            {meetings
              .find(
                (month) => month.month === day.month && month.year === day.year,
              )
              ?.meetings.find(
                (meeting) =>
                  parseInt(meeting.start_time.split(" ")[0].split("/")[0]) ===
                  day.day,
              ) ? (
              <p className="absolute bottom-2 right-2 aspect-square w-[12.5%] animate-pulse rounded-full bg-blue-500 group-hover:bg-amber-500 dark:bg-blue-400 group-hover:dark:bg-amber-300" />
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Calendar;
