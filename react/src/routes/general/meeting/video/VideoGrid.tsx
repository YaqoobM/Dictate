import { FC, MutableRefObject, useRef } from "react";
import { LocalVideo, PeerVideo } from ".";
import { Participant, ParticipantStream } from "../types.ts";

type Props = {
  participants: Participant[];
  participantStreams: MutableRefObject<ParticipantStream[]>;
  gotLocalStream: boolean;
  localParticipant: MutableRefObject<Participant | null>;
  localParticipantStream: MutableRefObject<MediaStream | null>;
};

const VideoGrid: FC<Props> = ({
  participants,
  participantStreams,
  gotLocalStream,
  localParticipant,
  localParticipantStream,
}) => {
  const grid = useRef<HTMLElement | null>(null);

  const getPeerStyles = () => {
    // if (grid.current && grid.current.offsetWidth <= 640) {
    //   return { width: "99%" };
    // }

    // add max values
    if (participants.length === 1) {
      return { height: "99%", width: "99%" };
    }

    if (participants.length === 2) {
      return { width: "calc(50% - 12px)" };
    }

    if (participants.length === 3) {
      return { width: "calc(33% - 24px)" };
    }

    if (participants.length === 4) {
      return { height: "50%" };
    }

    return { width: "calc(33% - 24px)" };
  };

  return (
    <div className="relative">
      <LocalVideo
        className="absolute left-1 top-1 z-10 max-w-32 sm:max-w-40"
        gotStream={gotLocalStream}
        stream={localParticipantStream}
        participant={localParticipant}
      />
      <section
        // !mr-3
        className="flex h-screen min-h-screen w-full flex-row flex-wrap items-center justify-center gap-3"
        ref={grid}
      >
        {participantStreams.current.map((stream, i) => (
          <PeerVideo
            className={`peer-video mx-auto max-w-screen-xl`}
            style={getPeerStyles()}
            stream={stream.stream}
            participant={
              participants.find((p) => p.channel === stream.channel) || null
            }
            key={stream.channel}
          />
        ))}
      </section>
    </div>
  );
};

export default VideoGrid;
