import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useContext,
} from "react";
import { useParams } from "react-router-dom";
import {
  Audio as AudioIcon,
  AudioMuted as AudioMutedIcon,
} from "../../../../assets/icons/meeting-controls";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "../../../../assets/icons/theme";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";
import { Button } from "../../../../components/utils";
import { ThemeContext } from "../../../../contexts";
import { useModal } from "../../../../hooks/components";
import { Participant } from "../types.ts";

type RouteParams = {
  meetingId: string;
};

type Props = {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
  setHideUsernameModal: Dispatch<SetStateAction<boolean>>;
  participants: Participant[];
  localParticipant: MutableRefObject<Participant | null>;
};

const InfoModal: FC<Props> = ({
  participants,
  localParticipant,
  hidden,
  setHidden,
  setHideUsernameModal,
}) => {
  const { meetingId } = useParams<keyof RouteParams>() as RouteParams;
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { Modal } = useModal();

  const toggleSetUsernameModal = () => {
    setHidden(true);
    setHideUsernameModal(false);
  };

  return (
    <Modal
      className="w-full max-w-xs p-5 sm:max-w-lg lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <div className="mb-2 lg:mb-3">
        <div className="mb-3 flex flex-row items-start gap-x-4 sm:items-center ">
          {theme === "dark" ? (
            <DarkModeIcon
              width="18"
              className="ml-1.5 mr-2 mt-1.5 cursor-pointer stroke-amber-500 dark:stroke-amber-300 sm:mr-[9px] sm:mt-0.5"
              onClick={() => toggleTheme(theme === "dark" ? "light" : "dark")}
            />
          ) : (
            <LightModeIcon
              width="33"
              className="mt-[3px] cursor-pointer stroke-amber-500 dark:stroke-amber-300"
              onClick={() => toggleTheme(theme === "dark" ? "light" : "dark")}
            />
          )}
          <h1 className="text-3xl font-semibold tracking-tight text-amber-500 dark:text-amber-300">
            Meeting Id:
            <span className="inline-block text-3xl font-medium tracking-normal sm:ml-4">
              {meetingId}
            </span>
          </h1>
        </div>
        <div>
          <h2 className="mb-0.5 text-xl font-semibold tracking-tight text-amber-500 dark:text-amber-300">
            Participants
          </h2>
          <div className="mb-3 text-sm">
            <div className="mb-4 grid grid-cols-1 gap-y-1 sm:mb-0 sm:flex sm:flex-row sm:justify-between">
              <div className="flex flex-row items-center justify-between gap-x-4 sm:w-full sm:justify-normal lg:gap-x-8">
                {localParticipant.current ? (
                  <>
                    <p>{localParticipant.current.username || "Guest"} (You)</p>
                    <p className="italic">
                      {localParticipant.current.email || "Not Signed In"}
                    </p>
                    {localParticipant.current.audioMuted ? (
                      <AudioMutedIcon className="h-6 stroke-red-600 dark:stroke-red-500" />
                    ) : (
                      <AudioIcon className="h-10 stroke-gray-950 dark:stroke-gray-100" />
                    )}
                  </>
                ) : (
                  <>
                    <p>(You)</p>
                    <LoadingIcon
                      className="animate-spin stroke-amber-500 dark:stroke-amber-300"
                      height="18"
                    />
                  </>
                )}
              </div>
              <Button
                className="inline-block w-full scale-[0.8] sm:w-2/3"
                onClick={toggleSetUsernameModal}
              >
                Change username
              </Button>
            </div>
            {participants
              .filter((p) => p.channel !== localParticipant.current?.channel)
              .map((participant, i) => (
                <div
                  className="flex flex-row items-center justify-between gap-x-4 sm:w-full sm:justify-normal lg:gap-x-8"
                  key={participant.channel}
                >
                  <p>{participant.username || "Guest"}</p>
                  <p className="italic">
                    {participant.email || "Not Signed In"}
                  </p>
                  {participant.audioMuted ? (
                    <AudioMutedIcon className="h-6 stroke-red-600 dark:stroke-red-500" />
                  ) : (
                    <AudioIcon className="h-10 stroke-gray-950 dark:stroke-gray-100" />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InfoModal;
