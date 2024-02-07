import { HTMLAttributes, forwardRef } from "react";

interface Props extends HTMLAttributes<HTMLElement> {}

const Card = forwardRef<HTMLElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <article
        className={`w-full max-w-md rounded-lg border border-gray-200 bg-gray-100 shadow-lg dark:border-gray-800 dark:bg-gray-900/40 dark:shadow-xl ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </article>
    );
  },
);

export default Card;
