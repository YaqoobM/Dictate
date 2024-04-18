import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Error as ErrorIcon } from "../../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";
import {
  DatePickerGroup,
  SelectGroup,
  SelectOption,
} from "../../../../components/forms";
import { Button } from "../../../../components/utils";
import { useModal } from "../../../../hooks/components";
import { useCreateMeeting } from "../../../../hooks/meetings";
import { useGetTeams } from "../../../../hooks/teams";

type Props = {
  selectedDay?: Date;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const ScheduleMeetingModal: FC<Props> = ({
  selectedDay,
  hidden,
  setHidden,
}) => {
  const defaultTeamOption: SelectOption = {
    label: "Please Select A Team",
    value: "placeholder",
    disabled: true,
  };

  const defaultTimeOption: SelectOption = {
    label: "Please Select A Time",
    value: "placeholder",
    disabled: true,
  };

  const [date, setDate] = useState<Date | null>(null);
  const [team, setTeam] = useState<SelectOption>(defaultTeamOption);
  const [startTime, setStartTime] = useState<SelectOption>(defaultTimeOption);
  const [endTime, setEndTime] = useState<SelectOption>(defaultTimeOption);

  const [errors, setErrors] = useState({
    date: "",
    team: "",
    startTime: "",
    endTime: "",
    general: "",
  });

  const { Modal } = useModal();

  const {
    teams,
    isPending: isTeamsPending,
    isError: isTeamsError,
  } = useGetTeams();

  const {
    create,
    reset,
    isPending: isCreatePending,
    isError: isCreateError,
    error,
  } = useCreateMeeting();

  const teamOptions: SelectOption[] = useMemo(() => {
    const array = [defaultTeamOption];

    if (isTeamsPending) {
      array.push({
        label: "Loading...",
        value: "loading",
        disabled: true,
      });
    } else if (isTeamsError || !teams) {
      array.push({
        label: "Something went wrong...",
        value: "error",
        disabled: true,
      });
    } else if (teams.length === 0) {
      array.push({
        label: "No teams available...",
        value: "not_available",
        disabled: true,
      });
    } else {
      array.push(
        ...teams.map((team) => ({ label: team.name, value: team.id })),
      );
    }

    return array;
  }, [teams, isTeamsPending]);

  //                         24 hours in 15 min intervals
  const timeOptions: SelectOption[] = Array(24 * 4)
    .fill(null)
    .map((_, i) => {
      let date = `${String(Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`;
      return { label: date, value: date };
    });

  const handleCreateMeeting = () => {
    // clear previous data
    setErrors({
      date: "",
      team: "",
      startTime: "",
      endTime: "",
      general: "",
    });
    reset();

    // build errors
    let tempErrors = {
      date: "",
      team: "",
      startTime: "",
      endTime: "",
      general: "",
    };

    if (team.disabled) {
      tempErrors.team = "this field is required";
    }

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
        team: "",
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
        team: "",
      });
    }

    let day = `${date!.getDate()}/${date!.getMonth() + 1}/${date!.getFullYear() % 100}`;

    create(
      {
        team: team.value,
        start_time: `${day} ${startTime.value}:00`,
        end_time: `${day} ${endTime.value}:00`,
      },
      {
        onSuccess: () => setHidden(true),
      },
    );
  };

  useEffect(() => {
    if (hidden) {
      setErrors({
        date: "",
        team: "",
        startTime: "",
        endTime: "",
        general: "",
      });
      setDate(null);
      setTeam(defaultTeamOption);
      setStartTime(defaultTimeOption);
      setEndTime(defaultTimeOption);
      reset();
    }
  }, [hidden]);

  useEffect(() => {
    setDate(selectedDay || null);
  }, [selectedDay]);

  return (
    <Modal
      className="flex w-full max-w-xs flex-col gap-y-2 p-5 sm:max-w-lg sm:gap-y-4 lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <h1 className="flex items-center gap-x-3 text-3xl font-semibold capitalize tracking-tight text-amber-500 dark:text-amber-300">
        <span>Schedule New Meeting</span>
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
      <div className="grid w-full grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-2">
        <div className="flex flex-col gap-y-2">
          <SelectGroup
            label="Team"
            value={team}
            setValue={setTeam}
            options={teamOptions}
            error={error?.data?.team || errors.team}
          />
          <DatePickerGroup
            label="Day"
            value={date}
            setValue={setDate}
            error={errors.date}
          />
        </div>
        <div className="flex flex-col gap-y-2">
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
      </div>
      <Button className="w-full" onClick={handleCreateMeeting}>
        Go
      </Button>
    </Modal>
  );
};

export default ScheduleMeetingModal;
