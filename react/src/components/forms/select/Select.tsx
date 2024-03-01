import { Dispatch, FC, HTMLAttributes, SetStateAction } from "react";
import { Chevron, Tick } from "../../../assets/icons/symbols";
import { useComponentVisibility } from "../../../hooks/components";

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: Option;
  options: Option[];
  setValue: Dispatch<SetStateAction<Option>>;
  label?: string;
  inputBox?: boolean;
  dropdownClass?: string;
}

const Select: FC<Props> = ({
  value,
  options,
  label,
  setValue,
  inputBox = true,
  dropdownClass,
  ...props
}) => {
  const { ref, isVisible, setIsVisible } =
    useComponentVisibility<HTMLDivElement>(false);

  const handleClick = (option: Option) => {
    setValue(option);
    setIsVisible(false);
  };

  return (
    <div className="relative" ref={ref} {...props}>
      <button
        className={`flex w-full flex-row justify-between gap-x-2 text-left focus:outline-none ${inputBox ? "rounded-lg border-[1.5px] border-gray-300 bg-transparent py-2.5 pl-2.5 pr-2 text-sm text-amber-500 focus:border-amber-500 dark:border-gray-600 dark:text-amber-300 dark:focus:border-amber-300" : "text-xl "}`}
        onClick={() => setIsVisible((prev) => !prev)}
      >
        <span className="block truncate tracking-wide">{value.label}</span>
        <span className="inset-y-0 right-0 flex items-center">
          <Chevron
            className={`${inputBox ? "w-4 fill-amber-500 dark:fill-amber-300" : "w-5 fill-gray-950 dark:fill-gray-100"}`}
          />
        </span>
      </button>
      <div
        className={`absolute left-1/2 top-[calc(100%_+_4px)] z-10 flex max-h-56 w-full -translate-x-1/2 flex-col gap-y-2 overflow-auto rounded-md border-[1.5px] border-gray-300 bg-gray-100 px-4 py-3.5 text-base text-gray-600 shadow-lg dark:bg-gray-900 dark:text-gray-300 dark:shadow-xl sm:text-sm ${isVisible ? "block" : "hidden"} ${inputBox ? "dark:border-gray-600" : "dark:border-gray-700"} ${dropdownClass}`}
      >
        {options.map((option, i) => (
          <div className="group flex flex-col justify-center gap-y-2" key={i}>
            <p
              className={`flex select-none flex-row items-center gap-x-1 ${option.disabled ? "opacity-70" : "cursor-pointer hover:text-amber-500 dark:hover:text-amber-300"}`}
              onClick={() => (option.disabled ? null : handleClick(option))}
            >
              <span className="block truncate tracking-wide">
                {option.label}
              </span>
              {option.value === value.value && !option.disabled ? (
                <span className="flex items-center">
                  <Tick className="w-5 fill-amber-500 dark:fill-amber-300" />
                </span>
              ) : (
                ""
              )}
            </p>
            <div className="h-px rounded-full bg-gray-300 group-last:hidden dark:bg-gray-600" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Select;
