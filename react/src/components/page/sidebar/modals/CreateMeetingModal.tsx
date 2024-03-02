import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Error as ErrorIcon,
  Success as SuccessIcon,
} from "../../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";
import { useModal } from "../../../../hooks/components";
import { useCreateMeeting } from "../../../../hooks/meetings";
import { useGetTeams } from "../../../../hooks/teams";
import { Select, SelectOption } from "../../../forms";
import { Button } from "../../../utils";

type Props = {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const CreateMeetingModal: FC<Props> = ({ hidden, setHidden }) => {
  const defaultOption: SelectOption = {
    label: "Anyone Can Join",
    value: "_no_team_selected_",
  };

  const [team, setTeam] = useState<SelectOption>(defaultOption);

  const { Modal } = useModal();
  const navigate = useNavigate();

  const {
    teams,
    isPending: isTeamsPending,
    isError: isTeamsError,
  } = useGetTeams();

  const { create, reset, isPending, isSuccess, isError, error } =
    useCreateMeeting();

  const options: SelectOption[] = useMemo(() => {
    const array = [defaultOption];

    if (isTeamsPending) {
      array.push({ label: "Loading...", value: "loading", disabled: true });
    } else if (isTeamsError || !teams) {
      array.push({
        label: "Something went wrong...",
        value: "error",
        disabled: true,
      });
    } else if (teams.length === 0) {
      array.push({
        label: "No teams available...",
        value: "no teams",
        disabled: true,
      });
    } else {
      array.push(
        ...teams.map((team) => ({ label: team.name, value: team.id })),
      );
    }

    return array;
  }, [teams, isTeamsPending]);

  const handleJoinMeeting = () => {
    create(
      { team: team.value === defaultOption.value ? undefined : team.value },
      {
        onSuccess: ({ data }) => {
          navigate(`/meeting/${data.id}`);
        },
      },
    );
  };

  useEffect(() => {
    if (hidden === true && (isSuccess || isError)) {
      reset();
    }
  }, [hidden]);

  return (
    <Modal
      className="w-full max-w-xs p-5 sm:max-w-lg lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <div className="mb-2 grid w-full grid-cols-1 items-end justify-center gap-x-3 lg:mb-3 lg:grid-cols-8">
        <h1 className="col-span-full mb-3 flex flex-row items-center gap-x-3 lg:col-span-3 lg:mb-0">
          <span className="text-3xl font-semibold tracking-tight text-amber-500 dark:text-amber-300">
            Start Meeting
          </span>
          {isPending ? (
            <LoadingIcon
              className="animate-spin stroke-amber-500 dark:stroke-amber-300"
              height="26"
            />
          ) : isError ? (
            <ErrorIcon className="stroke-red-600" height="26" />
          ) : isSuccess ? (
            <SuccessIcon className="stroke-green-600" height="26" />
          ) : (
            ""
          )}
        </h1>
        {error ? (
          <p className="text-sm font-medium capitalize text-red-500 lg:col-span-3 lg:text-right">
            {(error.data && Object.values(error.data)[0]) ||
              "Something went wrong"}
          </p>
        ) : (
          ""
        )}
      </div>
      <div className="grid grid-cols-1 gap-x-3 lg:grid-cols-4">
        <Select
          className="lg:col-span-3"
          value={team}
          setValue={setTeam}
          options={options}
        />
        <Button className="mt-5 lg:mt-0" onClick={handleJoinMeeting}>
          Go
        </Button>
      </div>
    </Modal>
  );
};

export default CreateMeetingModal;
