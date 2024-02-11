import { Dispatch, HTMLAttributes, SetStateAction, forwardRef } from "react";
import { Close } from "../../../assets/icons/buttons";

interface Props extends HTMLAttributes<HTMLDivElement> {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
}

const Modal = forwardRef<HTMLDivElement, Props>(
  ({ hidden, setHidden, className, children, ...props }, ref) => {
    return (
      <div
        className={`fixed inset-0 z-50 transition-colors duration-300 ${hidden ? "invisible" : "visible bg-gray-900/70"}`}
        onClick={() => setHidden(true)}
      >
        <div
          className={`relative left-1/2 top-1/4 inline-block min-h-12 min-w-40 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-gray-100 shadow-lg transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 dark:shadow-xl ${hidden ? "scale-[1.03] opacity-0" : "scale-100 opacity-100"} ${className}`}
          onClick={(e) => e.stopPropagation()}
          ref={ref}
          {...props}
        >
          <Close
            className="absolute right-3 top-2 cursor-pointer hover:stroke-amber-500 dark:hover:stroke-amber-300"
            height="30"
            onClick={() => setHidden(true)}
          />
          {children}
        </div>
      </div>
    );
  },
);

export default Modal;
