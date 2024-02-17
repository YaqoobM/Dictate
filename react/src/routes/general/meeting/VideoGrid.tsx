import { FC, MutableRefObject } from "react";
import { Instance as PeerInstance } from "simple-peer";
import { LocalVideo, PeerVideo } from ".";

type Participant = {
  // uid
  channel: string;
  username: string | null;
};

type ParticipantStream = {
  // uid
  channel: string;
  peer: PeerInstance;
};

type Props = {
  gotLocalStream: boolean;
  localStream: MutableRefObject<MediaStream | null>;
  participants: Participant[];
  participantStreams: MutableRefObject<ParticipantStream[]>;
};

const VideoGrid: FC<Props> = ({
  gotLocalStream,
  localStream,
  participants,
  participantStreams,
}) => {
  const getVideoWidth = () => {
    if (participants.length > 2) {
      return "max-w-xl";
    }
    if (participants.length > 1) {
      return "max-w-2xl";
    }
    return "max-w-3xl";
  };

  return (
    <>
      <LocalVideo
        className="max-w-32 sm:max-w-40"
        gotStream={gotLocalStream}
        stream={localStream}
      />
      <section className="flex flex-wrap items-center justify-center gap-3">
        {participantStreams.current.map((stream, i) => (
          <PeerVideo
            className={`w-full ${getVideoWidth()}`}
            peer={stream.peer}
            username={
              participants.find((p) => stream.channel === p.channel)
                ?.username || "Unknown"
            }
            key={i}
          />
        ))}
      </section>
    </>
  );
};

export default VideoGrid;
