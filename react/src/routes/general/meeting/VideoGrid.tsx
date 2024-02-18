import { FC, MutableRefObject, useEffect, useState } from "react";
import { LocalVideo, PeerVideo } from ".";
import { Participant, ParticipantStream } from "./types.ts";

type Props = {
  gotLocalStream: boolean;
  localStream: MutableRefObject<MediaStream | null>;
  participants: Participant[];
  participantStreams: MutableRefObject<ParticipantStream[]>;
  localParticipant: MutableRefObject<Participant | null>;
};

const VideoGrid: FC<Props> = ({
  gotLocalStream,
  localStream,
  participants,
  participantStreams,
  localParticipant,
}) => {
  const getPeerStyles = (stream: ParticipantStream) => {
    if (participants.length === 1) {
      // stream.peer
    }
    return {};
  };

  const getGridCols = () => {
    let numberOfParticipants = participants.length;

    if (numberOfParticipants % 4 === 0 && numberOfParticipants > 4) {
      return 4;
    }
    if (numberOfParticipants % 3 === 0 && numberOfParticipants > 3) {
      return 3;
    }
    if (numberOfParticipants % 2 === 0 || numberOfParticipants === 3) {
      return 2;
    }
    if (numberOfParticipants === 1) {
      return 1;
    }
    if (numberOfParticipants < 6) {
      return 2;
    }
    return 3;
  };

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
    <div className="relative">
      <LocalVideo
        className="absolute left-1 top-1 max-w-32 sm:max-w-40"
        gotStream={gotLocalStream}
        stream={localStream}
        username={localParticipant.current?.username || "Unknown"}
      />
      <section className="flex min-h-screen w-full flex-row flex-wrap items-center justify-center gap-3">
        {participantStreams.current.map((stream, i) => (
          <PeerVideo
            className={`mx-auto h-screen max-h-screen`}
            style={getPeerStyles(stream)}
            peer={stream.peer}
            username={
              participants.find((p) => stream.channel === p.channel)
                ?.username || "Unknown"
            }
            key={i}
          />
        ))}
      </section>
    </div>
  );
};

export default VideoGrid;
