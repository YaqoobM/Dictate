import {
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  forwardRef,
  useEffect,
} from "react";
import { Close } from "../../../assets/icons/buttons";

interface Props extends HTMLAttributes<HTMLDivElement> {
  styled?: boolean;
  close?: boolean;
  closeClassName?: string;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
}

const Modal = forwardRef<HTMLDivElement, Props>(
  (
    {
      styled = true,
      close = true,
      closeClassName,
      hidden,
      setHidden,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    useEffect(() => {
      if (hidden) {
        if (document.body.classList.contains("overflow-y-hidden")) {
          document.body.classList.remove("overflow-y-hidden");
        }
      } else {
        if (!document.body.classList.contains("overflow-y-hidden")) {
          document.body.classList.add("overflow-y-hidden");
        }
      }
    }, [hidden]);

    return (
      <div
        className={`fixed inset-0 z-50 max-h-screen overflow-y-scroll transition-colors duration-300 ${hidden ? "invisible" : "visible bg-gray-900/70"}`}
        onClick={() => setHidden(true)}
      >
        <div
          // margin-bottom = top displacement x2
          className={`relative top-[20%] mx-auto mb-[40vh] block min-h-12 min-w-40 transition-all duration-300 ${styled ? "rounded-lg border border-gray-200 bg-gray-100 shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:shadow-xl" : null} ${hidden ? "scale-[1.03] opacity-0" : "scale-100 opacity-100"} ${className}`}
          onClick={(e) => e.stopPropagation()}
          ref={ref}
          {...props}
        >
          {close ? (
            <Close
              className={`absolute right-3 top-2 cursor-pointer stroke-gray-950 hover:stroke-amber-500 dark:stroke-gray-100 dark:hover:stroke-amber-300 ${closeClassName}`}
              height="30"
              onClick={() => setHidden(true)}
            />
          ) : null}
          {children}
        </div>
      </div>
    );
  },
);

export default Modal;
