import { Dispatch, FC, SetStateAction } from "react";
import { ResourceInfo } from "..";
import { useModal } from "../../../../hooks/components";
import { Recording } from "../../../../types";

type Props = {
  resource: Recording & ResourceInfo;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const ViewRecordingModal: FC<Props> = ({ resource, hidden, setHidden }) => {
  const { Modal } = useModal();

  return (
    <Modal
      className="!top-[10%] !mb-[20vh] w-full max-w-xs p-5 sm:max-w-lg lg:max-w-2xl"
      closeClassName="bg-gray-100/50 dark:bg-gray-800/50 rounded-full"
      hidden={hidden}
      setHidden={setHidden}
    >
      <video src={resource.upload} controls />
    </Modal>
  );
};

export default ViewRecordingModal;
