import { Dispatch, FC, HTMLAttributes, SetStateAction, useState } from "react";
import { Chevron } from "../../../assets/icons/symbols";
import {
  useCalendar,
  useGetDay,
  useGetMonth,
  useGetSuffix,
} from "../../../hooks/calendar";
import { useComponentVisibility } from "../../../hooks/components";

type Day = {
  day: number;
  month: number;
  year: number;
  disabled?: boolean;
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: Date | null;
  setValue: Dispatch<SetStateAction<Date | null>>;
}

const DatePicker: FC<Props> = ({ value, setValue, ...props }) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    value ? new Date(value.getFullYear(), value.getMonth()) : new Date(),
  );

  const { ref, isVisible, setIsVisible } =
    useComponentVisibility<HTMLDivElement>(false);

  const calendar: Day[] = useCalendar(selectedMonth);

  const handleClick = (day: Day) => {
    setValue(new Date(day.year, day.month, day.day));
    setIsVisible(false);
  };

  return (
    <div className="" {...props}>
      <div className="relative" ref={ref}>
        <button
          className="flex w-full flex-row justify-between gap-x-2 rounded-lg border-[1.5px] border-gray-300 bg-transparent py-2.5 pl-2.5 pr-2 text-left text-sm text-amber-500 focus:border-amber-500 focus:outline-none dark:border-gray-600 dark:text-amber-300 dark:focus:border-amber-300"
          onClick={() => setIsVisible((prev) => !prev)}
        >
          <span className="block truncate capitalize tracking-wide">
            {value
              ? `${useGetDay(value.getDay())} ${value.getDate()}${useGetSuffix(value.getDate())} ${useGetMonth(value.getMonth())} ${value.getFullYear()}`
              : "Please select a date"}
          </span>
          <span className="inset-y-0 right-0 flex items-center">
            <Chevron className="w-4 fill-amber-500 dark:fill-amber-300" />
          </span>
        </button>
        <div
          className={`absolute left-1/2 top-[calc(100%_+_4px)] z-10 flex w-max -translate-x-1/2 flex-col justify-center gap-y-2 overflow-auto rounded-md border-[1.5px] border-gray-300 bg-gray-100 px-4 py-3.5 text-base text-gray-600 shadow-lg dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:shadow-xl sm:text-sm ${isVisible ? "block" : "hidden"}`}
        >
          <div className="space-y-0.5">
            <div className="mx-1.5 grid grid-cols-5 items-center gap-x-3 pb-3">
              <div className="col-span-1 justify-self-start">
                <button
                  className="flex size-8 items-center justify-center rounded-full border-2 border-transparent hover:bg-gray-200/50 focus:outline-none focus-visible:border-amber-500 dark:hover:bg-gray-800/50 dark:focus-visible:border-amber-300"
                  onClick={() =>
                    setSelectedMonth(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() - 1),
                    )
                  }
                >
                  <Chevron className="h-[18px] rotate-90 fill-amber-500 dark:fill-amber-300" />
                </button>
              </div>

              <div className="col-span-3 flex items-center justify-center gap-x-1 justify-self-center font-medium capitalize text-amber-500 dark:text-amber-300">
                <p>{useGetMonth(selectedMonth.getMonth())}</p>
                <span>/</span>
                <p>{selectedMonth.getFullYear()}</p>
              </div>

              <div className="col-span-1 justify-self-end">
                <button
                  className="flex size-8 items-center justify-center rounded-full border-2 border-transparent hover:bg-gray-200/50 focus:outline-none focus-visible:border-amber-500 dark:hover:bg-gray-800/50 dark:focus-visible:border-amber-300"
                  onClick={() =>
                    setSelectedMonth(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() + 1),
                    )
                  }
                >
                  <Chevron className="h-[18px] -rotate-90 fill-amber-500 dark:fill-amber-300" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7">
              <p className="m-px w-10 pb-1.5 text-center text-sm">Mo</p>
              <p className="m-px w-10 pb-1.5 text-center text-sm">Tu</p>
              <p className="m-px w-10 pb-1.5 text-center text-sm">We</p>
              <p className="m-px w-10 pb-1.5 text-center text-sm">Th</p>
              <p className="m-px w-10 pb-1.5 text-center text-sm">Fr</p>
              <p className="m-px w-10 pb-1.5 text-center text-sm">Sa</p>
              <p className="m-px w-10 pb-1.5 text-center text-sm">Su</p>

              {calendar.map((day, i) => (
                <button
                  type="button"
                  className={`m-px size-10 rounded-full border-2 border-transparent text-sm hover:border-amber-500 hover:text-amber-500 focus:outline-none focus-visible:border-amber-500 disabled:pointer-events-none disabled:opacity-50 dark:hover:border-amber-300 dark:hover:text-amber-300 dark:focus-visible:border-amber-300 ${value && value.getFullYear() === day.year && value.getMonth() == day.month && value.getDate() === day.day ? "bg-amber-500/70 dark:bg-amber-300/70" : null}`}
                  disabled={day.disabled}
                  onClick={() => handleClick(day)}
                  key={i}
                >
                  {day.day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
