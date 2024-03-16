import {
  FC,
  HTMLAttributes,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Video } from ".";
import { Participant } from "../types.ts";

interface Props extends HTMLAttributes<HTMLElement> {
  participant: MutableRefObject<Participant | null>;
  stream: MutableRefObject<MediaStream | null>;
  gotStream: boolean;
}

const LocalVideo: FC<Props> = ({
  participant,
  stream,
  gotStream,
  ...props
}) => {
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

    if (videoRef.current && stream.current) {
      videoRef.current.srcObject = stream.current;
      setVideoAvailability(true);

      tracks = stream.current.getVideoTracks();
      for (const track of tracks) {
        track.addEventListener("ended", handleTrackEnded);
      }
    }

    return () => {
      for (const track of tracks) {
        track.removeEventListener("ended", handleTrackEnded);
      }
    };
  }, [gotStream]);

  return (
    <Video
      videoMuted={participant.current ? participant.current.videoMuted : true}
      videoRef={videoRef}
      muted={true}
      {...props}
    />
  );
};

export default LocalVideo;
