import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { Exit as ExitIcon } from "../../../../assets/icons/buttons";
import {
  Chat as ChatIcon,
  Record as RecordIcon,
} from "../../../../assets/icons/meeting-controls";
import { Info as InfoIcon } from "../../../../assets/icons/symbols";
import { useModal } from "../../../../hooks/components";
import { useSaveRecording } from "../../../../hooks/meetings/useSaveRecording";
import {
  ExitModal,
  InfoModal,
  RecordingModal,
  SaveRecordingModal,
} from "../modals";
import { Participant } from "../types";

type Props = {
  participants: Participant[];
  setHideUsernameModal: Dispatch<SetStateAction<boolean>>;
  localParticipant: MutableRefObject<Participant | null>;
  setShowNotes: Dispatch<SetStateAction<boolean>>;
};

type States = {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
};

type RouteParams = {
  meetingId: string;
};

const Controls: FC<Props> = ({
  participants,
  localParticipant,
  setHideUsernameModal,
  setShowNotes,
}) => {
  const [recording, setRecording] = useState<boolean>(false);
  const [recordingStates, setRecordingStates] = useState<States>({
    isPending: false,
    isSuccess: false,
    isError: false,
  });

  const recorder = useRef<{
    stream: MediaStream | null;
    recorder: MediaRecorder | null;
    chunks: Blob[];
  }>({ stream: null, recorder: null, chunks: [] });

  const { meetingId } = useParams<keyof RouteParams>() as RouteParams;

  const { hidden: hideInfoModal, setHidden: setHideInfoModal } = useModal();
  const { hidden: hideRecordingModal, setHidden: setHideRecordingModal } =
    useModal();
  const {
    hidden: hideRecordingSuccessModal,
    setHidden: setHideRecordingSuccessModal,
  } = useModal();
  const { hidden: hideExitModal, setHidden: setHideExitModal } = useModal();

  const { create, reset, isPending, isSuccess, isError } = useSaveRecording();

  useEffect(() => {
    if (recording) {
      setRecordingStates({ isPending: true, isSuccess: false, isError: false });
      let opts = {
        audio: true,
        video: { displaySurface: "browser" },
        preferCurrentTab: true,
      };
      navigator.mediaDevices
        .getDisplayMedia(opts)
        .then((stream) => {
          recorder.current.stream = stream;
          recorder.current.recorder = new MediaRecorder(stream, {
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
            mimeType: "video/webm;codecs=vp8",
          });

          // store stream data
          recorder.current.recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              recorder.current.chunks.push(e.data);
            }
          };

          // handle stop event (force clean-up)
          recorder.current.recorder.onstop = () => {
            setRecording(false);
          };

          recorder.current.stream.getTracks().forEach((track) => {
            track.onended = () => recorder.current.recorder?.stop();
          });

          setRecordingStates({
            isPending: false,
            isSuccess: true,
            isError: false,
          });

          recorder.current.recorder.start(200);
          return;
        })
        .catch(() => {
          setRecordingStates({
            isPending: false,
            isSuccess: false,
            isError: true,
          });
          setRecording(false);
          return;
        });
    }

    if (!recording && recorder.current.recorder) {
      recorder.current.recorder.stop();
    }

    return () => {
      if (recording && recorder.current.chunks.length > 0) {
        // save file
        const file = new File(recorder.current.chunks, "my_recording.webm", {
          type: "video/webm",
        });
        create({ meeting: meetingId, file });
        setHideRecordingSuccessModal(false);

        // clean-up
        recorder.current.chunks = [];
        recorder.current.recorder = null;
        recorder.current.stream?.getTracks().forEach((track) => track.stop());
        recorder.current.stream = null;
      }
    };
  }, [recording]);

  useEffect(() => {
    if (hideRecordingModal) {
      setRecordingStates({
        isPending: false,
        isSuccess: false,
        isError: false,
      });
    }
  }, [hideRecordingModal]);

  return (
    <>
      <article className="fixed bottom-[10%] left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-row items-center gap-x-4 rounded-3xl border-[1.5px] border-gray-500 bg-gray-100 bg-gradient-to-r from-gray-100 to-gray-200/20 px-3 py-1.5 opacity-30 shadow-md hover:opacity-100 dark:border-gray-400 dark:bg-gray-900/70 dark:bg-none dark:text-gray-100 dark:shadow-none lg:bottom-[5%] lg:shadow-lg">
        <InfoIcon
          className="h-[50px] cursor-pointer stroke-gray-500 hover:stroke-amber-500 dark:stroke-gray-400 dark:hover:stroke-amber-300"
          onClick={() => setHideInfoModal((prev) => !prev)}
        />
        <ChatIcon
          className="h-[50px] cursor-pointer stroke-gray-500 hover:stroke-amber-500 dark:stroke-gray-400 dark:hover:stroke-amber-300"
          onClick={() => setShowNotes((prev) => !prev)}
        />
        <RecordIcon
          height="35"
          className={`mx-[7px] cursor-pointer stroke-gray-500 hover:stroke-amber-500 dark:stroke-gray-400 dark:hover:stroke-amber-300 ${recording ? "animate-pulse !stroke-amber-500 dark:!stroke-amber-300" : ""}`}
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
        recording={recording}
        setRecording={setRecording}
        recordingStates={recordingStates}
        recorder={recorder.current.recorder}
      />
      <SaveRecordingModal
        isPending={isPending}
        isSuccess={isSuccess}
        isError={isError}
        reset={reset}
        hidden={hideRecordingSuccessModal}
        setHidden={setHideRecordingSuccessModal}
      />
      <ExitModal hidden={hideExitModal} setHidden={setHideExitModal} />
    </>
  );
};

export default Controls;
