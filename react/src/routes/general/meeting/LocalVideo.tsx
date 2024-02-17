import { FC, HTMLAttributes, MutableRefObject, useEffect, useRef } from "react";
import { Video } from ".";

interface Props extends HTMLAttributes<HTMLElement> {
  stream: MutableRefObject<MediaStream | null>;
  gotStream: boolean;
}

const LocalVideo: FC<Props> = ({ stream, gotStream, ...props }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (gotStream && videoRef.current) {
      videoRef.current.srcObject = stream.current;
    }
  }, [gotStream]);

  return <Video ref={videoRef} {...props} />;
};

export default LocalVideo;
