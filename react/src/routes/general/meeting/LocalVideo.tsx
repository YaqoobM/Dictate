import { FC, HTMLAttributes, MutableRefObject, useEffect, useRef } from "react";
import { Video } from ".";

interface Props extends HTMLAttributes<HTMLElement> {
  stream: MutableRefObject<MediaStream | null>;
  gotStream: boolean;
  username: string;
}

const LocalVideo: FC<Props> = ({ username, stream, gotStream, ...props }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (gotStream && videoRef.current) {
      videoRef.current.srcObject = stream.current;
    }
  }, [gotStream]);

  return (
    <Video
      username={username}
      usernameClassName="!text-sm !font-normal !mt-0.5"
      ref={videoRef}
      {...props}
    />
  );
};

export default LocalVideo;
