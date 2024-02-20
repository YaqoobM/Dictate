import { Dispatch, FC, SetStateAction } from "react";
import { Button } from "../../../components/utils";
import { useModal } from "../../../hooks/components";

type Props = {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const RecordingModal: FC<Props> = ({ hidden, setHidden }) => {
  const { Modal } = useModal();

  const handleRecord = () => {
    // do stuff here
  };

  return (
    <Modal
      className="flex w-full max-w-xs flex-col gap-y-2 p-5 sm:max-w-lg sm:gap-y-4 lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <h1 className="text-3xl font-semibold capitalize tracking-tight text-amber-500 dark:text-amber-300">
        Start/Stop Recording?
      </h1>
      <Button className="w-full" onClick={handleRecord}>
        Go
      </Button>
    </Modal>
  );
};

export default RecordingModal;
