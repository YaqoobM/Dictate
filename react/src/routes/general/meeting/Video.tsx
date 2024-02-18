import { HTMLAttributes, forwardRef } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  username?: string;
  usernameClassName?: string;
  rounded?: boolean;
}

const Video = forwardRef<HTMLVideoElement, Props>(
  (
    {
      username,
      usernameClassName,
      rounded = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // todo: loader

    return (
      <article className={`inline-block ${className}`} {...props}>
        <video
          className={`h-full w-full ${rounded ? "rounded" : ""}`}
          ref={ref}
          autoPlay
        />
      </article>
      // {username ? (
      //   <h1
      //     className={`mt-1 text-center text-xl font-medium text-amber-500 dark:text-amber-300 ${usernameClassName}`}
      //   >
      //     {username}
      //   </h1>
      // ) : (
      //   ""
      // )}
    );
  },
);

export default Video;
