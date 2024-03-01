import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Error as ErrorIcon } from "../../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";
import {
  DatePickerGroup,
  SelectGroup,
  SelectOption,
} from "../../../../components/forms";
import { Button } from "../../../../components/utils";
import { useModal } from "../../../../hooks/components";
import { usePatchMeeting } from "../../../../hooks/meetings";
import { Meeting } from "../../../../types";

type Props = {
  meeting: Meeting | null;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const ScheduleMeetingModal: FC<Props> = ({ meeting, hidden, setHidden }) => {
  const defaultTimeOption: SelectOption = {
    label: "Please Select A Time",
    value: "placeholder",
    disabled: true,
  };

  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<SelectOption>(defaultTimeOption);
  const [endTime, setEndTime] = useState<SelectOption>(defaultTimeOption);

  const [errors, setErrors] = useState({
    date: "",
    startTime: "",
    endTime: "",
    general: "",
  });

  const { Modal } = useModal();

  const {
    create,
    reset,
    isPending: isCreatePending,
    isError: isCreateError,
    error,
  } = usePatchMeeting();

  //                         24 hours in 15 min intervals
  const timeOptions: SelectOption[] = Array(24 * 4)
    .fill(null)
    .map((_, i) => {
      let date = `${String(Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`;
      return { label: date, value: date };
    });

  const handleJoinMeeting = () => {
    // clear previous data
    setErrors({
      date: "",
      startTime: "",
      endTime: "",
      general: "",
    });
    reset();

    // build errors
    let tempErrors = {
      date: "",
      startTime: "",
      endTime: "",
      general: "",
    };

    if (!date) {
      tempErrors.date = "this field is required";
    }

    if (startTime.disabled) {
      tempErrors.startTime = "this field is required";
    }

    if (endTime.disabled) {
      tempErrors.endTime = "this field is required";
    }

    if (Object.values(tempErrors).some((value) => value)) {
      return setErrors(tempErrors);
    }

    let today = new Date();

    if (
      today.getTime() >
      new Date(
        date!.getFullYear(),
        date!.getMonth(),
        date!.getDate(),
        parseInt(startTime.value.split(":")[0]),
        parseInt(startTime.value.split(":")[1]),
      ).getTime()
    ) {
      return setErrors({
        general: "Meetings can only be scheduled for dates in the future",
        date: "",
        startTime: "",
        endTime: "",
      });
    }

    if (
      parseInt(startTime.value.split(":")[0]) >
        parseInt(endTime.value.split(":")[0]) ||
      (parseInt(startTime.value.split(":")[0]) ===
        parseInt(endTime.value.split(":")[0]) &&
        parseInt(startTime.value.split(":")[1]) >
          parseInt(endTime.value.split(":")[1])) ||
      startTime.value == endTime.value
    ) {
      return setErrors({
        general: "",
        date: "",
        startTime: "Must be before end time",
        endTime: "",
      });
    }

    let day = `${date!.getDate()}/${date!.getMonth() + 1}/${date!.getFullYear() % 100}`;

    if (meeting) {
      create(
        {
          id: meeting.id,
          start_time: `${day} ${startTime.value}:00`,
          end_time: `${day} ${endTime.value}:00`,
        },
        {
          onSuccess: () => setHidden(true),
        },
      );
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (hidden) {
      // delay clearing inputs until modal closes
      timeout = setTimeout(() => {
        setErrors({
          date: "",
          startTime: "",
          endTime: "",
          general: "",
        });
        setDate(null);
        setStartTime(defaultTimeOption);
        setEndTime(defaultTimeOption);
        reset();
      }, 300);
    } else {
      if (meeting) {
        let date = new Date(
          parseInt(`20${meeting.start_time.split(" ")[0].split("/")[2]}`),
          parseInt(meeting.start_time.split(" ")[0].split("/")[1]) - 1,
          parseInt(meeting.start_time.split(" ")[0].split("/")[0]),
          parseInt(meeting.start_time.split(" ")[1].split(":")[0]),
          parseInt(meeting.start_time.split(" ")[1].split(":")[1]),
          parseInt(meeting.start_time.split(" ")[1].split(":")[2]),
        );
        setDate(date);
        setStartTime({
          label: `${meeting.start_time.split(" ")[1].split(":")[0]}:${meeting.start_time.split(" ")[1].split(":")[1]}`,
          value: `${meeting.start_time.split(" ")[1].split(":")[0]}:${meeting.start_time.split(" ")[1].split(":")[1]}`,
        });

        if (meeting.end_time) {
          setEndTime({
            label: `${meeting.end_time.split(" ")[1].split(":")[0]}:${meeting.end_time.split(" ")[1].split(":")[1]}`,
            value: `${meeting.end_time.split(" ")[1].split(":")[0]}:${meeting.end_time.split(" ")[1].split(":")[1]}`,
          });
        }
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [hidden]);

  return (
    <Modal
      className="!top-1/3 flex w-full max-w-xs flex-col gap-y-2 p-5 sm:max-w-lg sm:gap-y-4 lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <h1 className="flex items-center gap-x-3 text-3xl font-semibold capitalize tracking-tight text-amber-500 dark:text-amber-300">
        <span>Update Meeting</span>
        {isCreatePending ? (
          <LoadingIcon
            className="animate-spin stroke-amber-500 dark:stroke-amber-300"
            height="26"
          />
        ) : isCreateError || Object.values(errors).some((value) => value) ? (
          <ErrorIcon className="stroke-red-600" height="26" />
        ) : null}
      </h1>
      {errors.general || error?.data?.time ? (
        <h2 className="font-medium capitalize leading-tight tracking-tight text-red-500">
          {errors.general || error!.data.time[0].split("_").join(" ")}
        </h2>
      ) : null}
      <div className="grid w-full grid-cols-1 gap-y-2">
        <DatePickerGroup
          label="Day"
          value={date}
          setValue={setDate}
          error={errors.date}
        />
        <SelectGroup
          label="Start Time"
          value={startTime}
          setValue={setStartTime}
          options={timeOptions}
          error={error?.data?.start_time || errors.startTime}
        />
        <SelectGroup
          label="End Time"
          value={endTime}
          setValue={setEndTime}
          options={timeOptions}
          error={error?.data?.end_time || errors.endTime}
        />
      </div>
      <Button className="w-full" onClick={handleJoinMeeting}>
        Go
      </Button>
    </Modal>
  );
};

export default ScheduleMeetingModal;
