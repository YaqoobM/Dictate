import {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
  forwardRef,
} from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  setValue?: Dispatch<SetStateAction<string>>;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, setValue, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (setValue) {
        setValue(e.target.value);
      }
    };

    return (
      <input
        className={`block w-full rounded-lg border-[1.5px] border-gray-300 bg-transparent p-2.5 text-sm text-amber-500 caret-gray-300 focus:border-amber-500 focus:outline-none dark:border-gray-600 dark:text-amber-300 dark:focus:border-amber-300 ${className}`}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  },
);

export default Input;
