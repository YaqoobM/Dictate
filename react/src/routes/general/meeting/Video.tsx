import { HTMLAttributes, forwardRef } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  username?: string;
}

const Video = forwardRef<HTMLVideoElement, Props>(
  ({ className, children, username, ...props }, ref) => {
    // todo: loader

    return (
      <article className={`inline-block ${className}`} {...props}>
        <video className="w-full rounded-sm" ref={ref} autoPlay />
        {username ? (
          <h1 className="mt-1 text-center text-xl font-medium text-amber-500 dark:text-amber-300">
            {username}
          </h1>
        ) : (
          ""
        )}
      </article>
    );
  },
);

export default Video;
