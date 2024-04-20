import { FC, HTMLAttributes, MutableRefObject } from "react";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";

interface Props extends HTMLAttributes<HTMLElement> {
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  videoMuted: boolean;
  username?: string;
  muted?: boolean;
}

const Video: FC<Props> = ({
  videoRef,
  username,
  videoMuted,
  className,
  children,
  muted = false,
  ...props
}) => {
  return (
    <article className={`flex ${className}`} {...props}>
      <div className="relative max-h-full w-full flex-grow overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
        <video
          className="mx-auto h-full"
          ref={videoRef}
          autoPlay
          playsInline
          onCanPlayThrough={() => {
            if (muted && videoRef.current) {
              videoRef.current.muted = true;
            }
          }}
        />
        {!videoRef.current?.srcObject || videoMuted ? (
          <div className="absolute inset-0 flex  flex-col items-center justify-center rounded border-[1.5px] border-gray-100 bg-gray-200 shadow-sm dark:border-gray-900 dark:bg-gray-800 dark:shadow">
            <LoadingIcon className="h-6 animate-spin stroke-amber-500 dark:stroke-amber-300 lg:h-8" />
            <h1 className="mt-0.5 text-xs tracking-tight text-amber-500 dark:text-amber-300 sm:mt-1 lg:mt-1.5 lg:text-sm">
              Loading
            </h1>
          </div>
        ) : username ? (
          <h1 className="absolute bottom-1 left-3 text-xs italic text-gray-800 dark:text-gray-200 sm:text-base">
            {username}
          </h1>
        ) : (
          ""
        )}
      </div>
    </article>
  );
};

export default Video;
