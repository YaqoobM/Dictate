import { FC, useContext, useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useNavigate, useParams } from "react-router-dom";
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
} from "../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../assets/icons/utils";
import { Button } from "../../../components/utils";
import { AuthContext } from "../../../contexts";
import { useModal } from "../../../hooks/components";
import { useMeetingWebsocket } from "../../../hooks/meetings";
import { Controls } from "./components";
import { SetUsernameModal } from "./modals";
import { Notes } from "./notes";
import { VideoGrid } from "./video";

type RouteParams = {
  meetingId: string;
};

const Meeting: FC = () => {
  const [gotLocalStream, setGotLocalStream] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);

  const { meetingId } = useParams<keyof RouteParams>() as RouteParams;
  const { isAuthenticated, checkingAuth } = useContext(AuthContext);

  const { hidden: hideSetUsernameModal, setHidden: setHideSetUsernameModal } =
    useModal();

  const navigate = useNavigate();

  const {
    websocket,
    isConnected,
    isError,
    localParticipant,
    localParticipantStream,
    participants,
    participantStreams,
    groupNotes,
    groupNotesState,
    error,
  } = useMeetingWebsocket(meetingId);

  useEffect(() => {
    let mounted: boolean = true;
    let tracks: MediaStreamTrack[] = [];

    const handleTrackEnded = (e: Event) => {
      if (
        e.target instanceof MediaStreamTrack &&
        localParticipantStream.current
      ) {
        if (isConnected) {
          if (e.target.kind === "video") {
            websocket.current?.send(
              JSON.stringify({
                type: "user_media",
                video_muted: true,
              }),
            );
          } else if (e.target.kind === "audio") {
            websocket.current?.send(
              JSON.stringify({
                type: "user_media",
                audio_muted: true,
              }),
            );
          }
        }
        for (const p of participantStreams.current) {
          p.peer?.removeTrack(e.target, localParticipantStream.current);
        }
      }
    };

    if (isConnected) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (!mounted) return null;

          websocket.current?.send(
            JSON.stringify({
              type: "user_media",
              audio_muted: false,
              video_muted: false,
            }),
          );

          localParticipantStream.current = stream;
          for (const p of participantStreams.current) {
            p.peer?.addStream(stream);
          }
          setGotLocalStream(true);

          tracks = stream.getTracks();
          for (const track of tracks) {
            track.addEventListener("ended", handleTrackEnded);
          }
        });
    }

    return () => {
      mounted = false;

      if (localParticipantStream.current) {
        localParticipantStream.current.getTracks().forEach((track) => {
          track.stop();
        });
      }

      for (const track of tracks) {
        track.removeEventListener("ended", handleTrackEnded);
      }
    };
  }, [isConnected]);

  useEffect(() => {
    if (!checkingAuth && !isAuthenticated) {
      setHideSetUsernameModal(false);
    }
  }, [checkingAuth]);

  // triggered on first load only (not if they disable camera after joining)
  if (!gotLocalStream) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-gray-100 text-gray-950 dark:bg-gray-900 dark:text-gray-100">
        <section className="flex flex-col items-center justify-center gap-y-5 lg:gap-y-7">
          <div className="flex flex-row items-center gap-x-3">
            <WarningIcon className="h-8 stroke-amber-500 dark:stroke-amber-300 lg:h-10" />
            <hgroup className="flex flex-col">
              <h1 className="text-lg capitalize tracking-wide text-amber-500 dark:text-amber-300 lg:text-xl">
                please allow camera and audio
              </h1>
              <h2 className="text-sm capitalize italic tracking-wide lg:text-base">
                try refreshing the page
              </h2>
            </hgroup>
          </div>
          <Button
            className="w-3/5 text-sm lg:text-base"
            onClick={() => navigate("/home")}
          >
            Go Home
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="h-screen min-h-screen w-screen overflow-y-scroll bg-gray-100 text-gray-950 dark:bg-gray-900 dark:text-gray-100">
      {isConnected ? (
        <>
          {showNotes ? (
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50}>
                <Notes
                  groupNotes={groupNotes}
                  groupNotesState={groupNotesState}
                  websocket={websocket}
                />
              </Panel>
              <PanelResizeHandle className="mr-3 w-0.5 bg-amber-500 dark:bg-amber-300" />
              <Panel>
                <VideoGrid
                  participants={participants}
                  participantStreams={participantStreams}
                  gotLocalStream={gotLocalStream}
                  localParticipant={localParticipant}
                  localParticipantStream={localParticipantStream}
                />
              </Panel>
            </PanelGroup>
          ) : (
            <VideoGrid
              participants={participants}
              participantStreams={participantStreams}
              gotLocalStream={gotLocalStream}
              localParticipant={localParticipant}
              localParticipantStream={localParticipantStream}
            />
          )}
          <Controls
            participants={participants}
            localParticipant={localParticipant}
            setHideUsernameModal={setHideSetUsernameModal}
            setShowNotes={setShowNotes}
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
        hidden={hideSetUsernameModal}
        setHidden={setHideSetUsernameModal}
        websocket={websocket}
      />
    </main>
  );
};

export default Meeting;
