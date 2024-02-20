import { FC, HTMLAttributes, useEffect, useRef, useState } from "react";
import { Video } from ".";
import { Participant } from "./types.ts";

interface Props extends HTMLAttributes<HTMLElement> {
  participant: Participant | null;
  stream: MediaStream | null;
}

const PeerVideo: FC<Props> = ({ stream, participant, ...props }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [, setVideoAvailability] = useState<boolean>(false);

  useEffect(() => {
    let tracks: MediaStreamTrack[] = [];

    const handleTrackEnded = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject = null;
        setVideoAvailability(false);
      }
    };

    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      setVideoAvailability(true);

      tracks = stream.getVideoTracks();
      for (const track of tracks) {
        track.addEventListener("mute", handleTrackEnded);
      }
    }

    return () => {
      for (const track of tracks) {
        track.removeEventListener("mute", handleTrackEnded);
      }
    };
  }, [stream]);

  return (
    <Video
      videoMuted={participant ? participant.videoMuted : true}
      username={participant?.username || "Guest"}
      videoRef={videoRef}
      {...props}
    />
  );
};

export default PeerVideo;
