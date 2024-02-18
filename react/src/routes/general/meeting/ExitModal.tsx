import { Dispatch, FC, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/utils";
import { useModal } from "../../../hooks/components";

type Props = {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const ExitModal: FC<Props> = ({ hidden, setHidden }) => {
  const navigate = useNavigate();
  const { Modal } = useModal();

  const handleExit = () => {
    navigate("/home");
  };

  return (
    <Modal
      className="flex w-full max-w-xs flex-col gap-y-2 p-5 sm:max-w-lg sm:gap-y-4 lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <h1 className="text-3xl font-semibold capitalize tracking-tight text-amber-500 dark:text-amber-300">
        Are you sure you want to exit?
      </h1>
      <Button className="w-full" onClick={handleExit}>
        Exit
      </Button>
    </Modal>
  );
};

export default ExitModal;
