import { ButtonHTMLAttributes, forwardRef } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={`rounded border border-gray-300 px-6 py-3 text-sm leading-none tracking-wide shadow-md hover:border-gray-400 focus:!border-amber-500 focus:outline-none dark:border-gray-800/70 dark:bg-gray-100/10 hover:dark:border-amber-300/70 hover:dark:bg-amber-300/70 focus:dark:!border-amber-300 lg:shadow ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export default Button;
