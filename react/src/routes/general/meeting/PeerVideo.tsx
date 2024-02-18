import { FC, HTMLAttributes, useEffect, useRef } from "react";
import { Instance as PeerInstance } from "simple-peer";
import { Video } from ".";

interface Props extends HTMLAttributes<HTMLElement> {
  peer: PeerInstance;
  username: string;
}

const PeerVideo: FC<Props> = ({ peer, username, ...props }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    peer.on("stream", (stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  return (
    <Video username={username} rounded={false} ref={videoRef} {...props} />
  );
};

export default PeerVideo;
