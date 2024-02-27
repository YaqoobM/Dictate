import { Dispatch, FC, SetStateAction } from "react";
import { Button } from "../../../../components/utils";
import { useModal } from "../../../../hooks/components";
import { useCreateMeeting } from "../../../../hooks/meetings";

type Props = {
  teamFilter: string;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const ScheduleMeetingModal: FC<Props> = ({ teamFilter, hidden, setHidden }) => {
  const { Modal } = useModal();

  const { create, reset, isPending, isSuccess, isError } = useCreateMeeting();

  const handleSave = () => {
    setHidden(true);
  };

  return (
    <Modal
      className="flex w-full max-w-xs flex-col gap-y-2 p-5 sm:max-w-lg sm:gap-y-4 lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <h1 className="text-3xl font-semibold capitalize tracking-tight text-amber-500 dark:text-amber-300">
        Schedule New Meeting
      </h1>
      <Button className="w-full" onClick={handleSave}>
        Go
      </Button>
    </Modal>
  );
};

export default ScheduleMeetingModal;
