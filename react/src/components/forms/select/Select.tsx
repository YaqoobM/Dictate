import { Dispatch, FC, HTMLAttributes, SetStateAction } from "react";
import { Chevron, Tick } from "../../../assets/icons/symbols";
import { useComponentVisibility } from "../../../hooks/components";

type Option = {
  label: string;
  value: string;
};

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
    <div className="" {...props}>
      {label ? (
        <label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      ) : null}
      <div className="relative" ref={ref}>
        <button
          className={`flex w-full flex-row justify-between gap-x-2 text-left focus:outline-none ${inputBox ? "rounded-lg border-[1.5px] border-gray-300 bg-transparent py-2.5 pl-2.5 pr-2 text-sm text-amber-500 focus:border-amber-500 dark:border-gray-600 dark:text-amber-300 dark:focus:border-amber-300" : "text-xl "}`}
          onClick={() => setIsVisible((prev) => !prev)}
        >
          <span className="block truncate">{value.label}</span>
          <span className="inset-y-0 right-0 flex items-center">
            <Chevron
              className={`${inputBox ? "w-4 fill-amber-500 dark:fill-amber-300" : "w-5 fill-gray-950 dark:fill-gray-100"}`}
            />
          </span>
        </button>
        <div
          className={`absolute left-1/2 top-[calc(100%_+_4px)] z-10 flex max-h-56 w-full -translate-x-1/2 flex-col overflow-auto rounded-md border py-1 text-base shadow-lg focus:outline-none sm:text-sm ${isVisible ? "block" : "hidden"} ${inputBox ? "dark:border-gray-800 dark:bg-gray-900" : "border-gray-300 bg-gray-200 text-gray-950"} ${dropdownClass}`}
        >
          {options.map((option, i) => (
            <p
              className={`flex select-none flex-row items-center gap-x-1 px-3 py-2 ${option.value === "disabled_option" ? "text-gray-600 dark:text-gray-300" : "cursor-pointer hover:text-amber-500 dark:hover:text-amber-300"}`}
              onClick={() => handleClick(option)}
              key={i}
            >
              <span className="block truncate font-normal tracking-tight">
                {option.label}
              </span>
              {option.value === value.value ? (
                <span className="flex items-center text-amber-500 dark:hover:text-amber-300">
                  <Tick className="w-5 fill-amber-500 dark:fill-amber-300" />
                </span>
              ) : (
                ""
              )}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Select;
