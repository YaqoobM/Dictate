import { FC, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Controls, LocalVideo, PeerVideo, VideoGrid } from ".";
import { Loader as LoadingIcon } from "../../../assets/icons/utils";
import { AuthContext, ThemeContext } from "../../../contexts";
import { useModal } from "../../../hooks/components";
import { useMeetingWebsocket } from "../../../hooks/meetings";

type RouteParams = {
  meetingId: string;
};

const Meeting: FC = () => {
  const { meetingId } = useParams<keyof RouteParams>() as RouteParams;
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated } = useContext(AuthContext);

  const {
    isPending,
    isConnected,
    isError,
    localStream,
    gotLocalStream,
    setGotLocalStream,
    participants,
    participantStreams,
    groupNotes,
    setGroupNotes,
    error,
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
      });
  }, []);

  return (
    <main className="min-h-screen w-screen bg-gray-100 p-1 text-gray-950 dark:bg-gray-900 dark:text-gray-100">
      {isPending ? (
        <div className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-y-2">
          <h1 className="font-medium text-amber-500 dark:text-amber-300">
            Please Wait
          </h1>
          <LoadingIcon className="h-10 animate-spin stroke-amber-500 dark:stroke-amber-300 lg:h-14" />
        </div>
      ) : isConnected ? (
        <>
          <VideoGrid
            gotLocalStream={gotLocalStream}
            localStream={localStream}
            participants={participants}
            participantStreams={participantStreams}
          />
          <Controls />
        </>
      ) : isError ? (
        "Something went wrong: error message"
      ) : (
        "Something went wrong"
      )}
      {/* SetUsernameModal -> if not signed in */}
    </main>
  );
};

export default Meeting;
