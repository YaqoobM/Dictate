import { LabelHTMLAttributes, forwardRef } from "react";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        className={`mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </label>
    );
  },
);

export default Label;
