import { Dispatch, FC, MutableRefObject, SetStateAction } from "react";
import { ExitModal, InfoModal, RecordingModal } from ".";
import { Exit as ExitIcon } from "../../../assets/icons/buttons";
import {
  Chat as ChatIcon,
  Record as RecordIcon,
} from "../../../assets/icons/meeting-controls";
import { Info as InfoIcon } from "../../../assets/icons/symbols";
import { useModal } from "../../../hooks/components";
import { Participant } from "./types";

type Props = {
  participants: Participant[];
  setHideUsernameModal: Dispatch<SetStateAction<boolean>>;
  localParticipant: MutableRefObject<Participant | null>;
};

const Controls: FC<Props> = ({
  participants,
  localParticipant,
  setHideUsernameModal,
}) => {
  const { hidden: hideInfoModal, setHidden: setHideInfoModal } = useModal();
  const { hidden: hideRecordingModal, setHidden: setHideRecordingModal } =
    useModal();
  const { hidden: hideExitModal, setHidden: setHideExitModal } = useModal();

  // recording states and useEffect

  return (
    <>
      <article className="fixed bottom-[10%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-row items-center gap-x-4 rounded-3xl border-[1.5px] border-gray-500 bg-gray-100 bg-gradient-to-r from-gray-100 to-gray-200/20 px-3 py-1.5 opacity-30 shadow-md hover:opacity-100 dark:border-gray-400 dark:bg-gray-900/70 dark:bg-none dark:text-gray-100 dark:shadow-none lg:bottom-[5%] lg:shadow-lg">
        <InfoIcon
          className="h-[50px] cursor-pointer stroke-gray-500 hover:stroke-amber-500 dark:stroke-gray-400 dark:hover:stroke-amber-300"
          onClick={() => setHideInfoModal((prev) => !prev)}
        />
        <ChatIcon className="h-[50px] cursor-pointer stroke-gray-500 hover:stroke-amber-500 dark:stroke-gray-400 dark:hover:stroke-amber-300" />
        <RecordIcon
          height="35"
          className="mx-[7px] cursor-pointer stroke-gray-500 hover:stroke-amber-500 dark:stroke-gray-400 dark:hover:stroke-amber-300"
          onClick={() => setHideRecordingModal((prev) => !prev)}
        />
        <ExitIcon
          height="35"
          className="ml-1 mr-2 cursor-pointer stroke-gray-500 hover:stroke-amber-500 dark:stroke-gray-400 dark:hover:stroke-amber-300"
          onClick={() => setHideExitModal((prev) => !prev)}
        />
      </article>

      <InfoModal
        hidden={hideInfoModal}
        setHidden={setHideInfoModal}
        setHideUsernameModal={setHideUsernameModal}
        participants={participants}
        localParticipant={localParticipant}
      />
      <RecordingModal
        hidden={hideRecordingModal}
        setHidden={setHideRecordingModal}
      />
      <ExitModal hidden={hideExitModal} setHidden={setHideExitModal} />
    </>
  );
};

export default Controls;
