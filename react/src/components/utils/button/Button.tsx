import { ButtonHTMLAttributes, forwardRef } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        // className={`rounded px-5 py-2 text-sm leading-tight tracking-tight shadow-md ring-1 ring-gray-300 hover:ring-gray-400 dark:bg-gray-100/10 dark:ring-gray-700 hover:dark:bg-gray-100/20 lg:shadow ${className}`}
        className={`rounded px-6 py-3 text-sm leading-none tracking-wide shadow-md ring-1 ring-gray-300 hover:ring-gray-400 dark:bg-gray-100/10 dark:ring-gray-700 hover:dark:bg-amber-300/70 hover:dark:ring-amber-300/60 lg:shadow ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export default Button;
