import { ButtonHTMLAttributes, forwardRef } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={`rounded px-6 py-3 text-sm leading-none tracking-wide shadow-md ring-2 ring-gray-300 hover:ring-gray-400 focus:outline-none focus:!ring-amber-500 dark:bg-gray-100/10 dark:ring-gray-800/70 hover:dark:bg-amber-300/70 hover:dark:ring-amber-300/70 focus:dark:!ring-amber-300 lg:shadow ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export default Button;
