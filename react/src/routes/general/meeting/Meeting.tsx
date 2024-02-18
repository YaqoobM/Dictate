import { FC, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Controls, SetUsernameModal, VideoGrid } from ".";
import { Error as ErrorIcon } from "../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../assets/icons/utils";
import { AuthContext } from "../../../contexts";
import { useModal } from "../../../hooks/components";
import { useMeetingWebsocket } from "../../../hooks/meetings";

type RouteParams = {
  meetingId: string;
};

const Meeting: FC = () => {
  const { meetingId } = useParams<keyof RouteParams>() as RouteParams;
  const { isAuthenticated, checkingAuth } = useContext(AuthContext);

  const { hidden: hideModal, setHidden: setHideModal } = useModal();

  const {
    isPending,
    isConnected,
    isError,
    localParticipant,
    localStream,
    gotLocalStream,
    setGotLocalStream,
    participants,
    participantStreams,
    groupNotes,
    setGroupNotes,
    error,
    websocket,
  } = useMeetingWebsocket(meetingId);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        for (const p of participantStreams.current) {
          p.peer?.addStream(stream);
        }
        setGotLocalStream(true);
        return stream;
      });

    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!checkingAuth && !isAuthenticated) {
      setHideModal(false);
    }
  }, [checkingAuth]);

  return (
    <main className="min-h-screen w-screen bg-gray-100 text-gray-950 dark:bg-gray-900 dark:text-gray-100">
      {isConnected ? (
        <>
          <VideoGrid
            gotLocalStream={gotLocalStream}
            localStream={localStream}
            participants={participants}
            participantStreams={participantStreams}
            localParticipant={localParticipant}
          />
          <Controls
            participants={participants}
            localParticipant={localParticipant}
            setHideUsernameModal={setHideModal}
          />
        </>
      ) : (
        <div className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-y-2">
          {isError ? (
            <>
              <h1 className="font-medium text-red-600">
                {isError ? error : "Something went wrong"}
              </h1>
              <ErrorIcon className="h-10 stroke-red-600 lg:h-14" />
            </>
          ) : (
            <>
              <h1 className="font-medium text-amber-500 dark:text-amber-300">
                Please Wait
              </h1>
              <LoadingIcon className="h-10 animate-spin stroke-amber-500 dark:stroke-amber-300 lg:h-14" />
            </>
          )}
        </div>
      )}

      <SetUsernameModal
        hidden={hideModal}
        setHidden={setHideModal}
        websocket={websocket}
      />
    </main>
  );
};

export default Meeting;
