import { Dispatch, FC, SetStateAction } from "react";
import { Arrow as ArrowIcon } from "../../../../assets/icons/symbols";
import { Button } from "../../../../components/utils";

type Props = {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  setHideScheduleMeetingModal: Dispatch<SetStateAction<boolean>>;
};

const Controls: FC<Props> = ({
  date,
  setDate,
  setHideScheduleMeetingModal,
}) => {
  const handleChangeMonth = (offset: "next" | "prev") => {
    let temp = new Date(date.getTime());
    temp.setDate(1);

    if (offset === "next") {
      temp.setMonth(temp.getMonth() + 1);
    } else {
      temp.setMonth(temp.getMonth() - 1);
    }

    setDate(temp);
  };

  return (
    <>
      <div className="flex items-center justify-between self-stretch">
        <h1
          className="group flex items-center gap-x-1.5 pt-1 text-lg tracking-tight hover:cursor-pointer"
          onClick={() => handleChangeMonth("prev")}
        >
          <ArrowIcon className="w-4 rotate-180 stroke-gray-950 group-hover:stroke-amber-500 dark:stroke-gray-100 group-hover:dark:stroke-amber-300" />
          <span className="pb-px text-sm font-medium uppercase group-hover:text-amber-500 group-hover:dark:text-amber-300">
            back
          </span>
        </h1>
        <h1 className="text-xl">
          {date.toLocaleString("en-us", { month: "long" })} {date.getFullYear()}
        </h1>
        <h1
          className="group flex items-center gap-x-1.5 pt-1 text-lg tracking-tight hover:cursor-pointer"
          onClick={() => handleChangeMonth("next")}
        >
          <span className="pb-px text-sm font-medium uppercase group-hover:text-amber-500 group-hover:dark:text-amber-300">
            next
          </span>
          <ArrowIcon className="w-4 stroke-gray-950 group-hover:stroke-amber-500 dark:stroke-gray-100 group-hover:dark:stroke-amber-300" />
        </h1>
      </div>
      <Button
        className="self-stretch"
        onClick={() => setHideScheduleMeetingModal((prev) => !prev)}
      >
        Schedule Meeting +
      </Button>
    </>
  );
};

export default Controls;
