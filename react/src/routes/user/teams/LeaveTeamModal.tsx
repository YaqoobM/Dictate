import { Dispatch, FC, SetStateAction } from "react";
import {
  Error as ErrorIcon,
  Success as SuccessIcon,
} from "../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../assets/icons/utils";
import { SelectOption } from "../../../components/forms";
import { Button } from "../../../components/utils";
import { useModal } from "../../../hooks/components";
import { useLeaveTeam } from "../../../hooks/teams";

type Props = {
  team: string;
  options: SelectOption[];
  setTeamFilter: Dispatch<SetStateAction<SelectOption>>;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const ExitModal: FC<Props> = ({
  team,
  options,
  setTeamFilter,
  hidden,
  setHidden,
}) => {
  const { Modal } = useModal();

  const { leave, reset, isPending, isSuccess, isError } = useLeaveTeam();

  const handleLeave = () => {
    leave(
      { id: team },
      {
        onSuccess: () => {
          reset();
        },
      },
    );

    if (options.length > 1) {
      setTeamFilter(options[1]);
    } else {
      setTeamFilter({
        label: "No teams available...",
        value: "no teams",
        disabled: true,
      });
    }

    setHidden(true);
  };

  return (
    <Modal
      className="flex w-full max-w-xs flex-col gap-y-2 p-5 sm:max-w-lg sm:gap-y-4 lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <h1 className="col-span-full mb-3 flex flex-row items-center gap-x-3 lg:col-span-3 lg:mb-0">
        <span className="text-3xl font-semibold tracking-tight text-amber-500 dark:text-amber-300">
          Are you sure you want to leave?
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
        ) : null}
      </h1>
      <Button className="w-full" onClick={handleLeave}>
        Leave
      </Button>
    </Modal>
  );
};

export default ExitModal;
