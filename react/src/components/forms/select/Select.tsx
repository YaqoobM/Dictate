import { Dispatch, FC, SetStateAction } from "react";
import ReactSelect, {
  GroupBase,
  OptionsOrGroups,
  Props as ReactSelectProps,
} from "react-select";

type SelectOption = {
  label: string;
  value: string;
};

interface Props extends ReactSelectProps {
  value: SelectOption;
  setValue: Dispatch<SetStateAction<SelectOption>>;
  options: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>;
}

const Select: FC<Props> = ({ value, setValue, options, ...props }: Props) => {
  const handleChange = (value: SelectOption | unknown) => {
    setValue(value as SelectOption);
  };

  return (
    <ReactSelect
      defaultValue={value}
      options={options}
      onChange={handleChange}
      classNames={{
        control: () => "!min-h-0 hover:cursor-pointer",
        valueContainer: () => "text-xl",
        indicatorsContainer: () => "my-auto ml-1.5 h-5",
        menu: () =>
          "absolute left-1/2 top-full w-max -translate-x-1/2 translate-y-1 rounded-md bg-gray-100 px-6 pb-5 pt-1 text-gray-950 shadow ring-1 ring-gray-300 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-800 lg:translate-y-2",
        option: (state) =>
          `my-1 !text-sm tracking-tight leading-snug ${state.isSelected ? "text-amber-500 dark:text-amber-300" : ""} ${!state.isDisabled ? "!cursor-pointer hover:text-amber-500 dark:hover:text-amber-300" : ""}`,
        groupHeading: () =>
          "mb-2 mt-4 w-min border-b border-gray-600 !text-xs mx-auto font-semibold uppercase text-gray-600 dark:border-gray-300 dark:text-gray-300",
      }}
      styles={{
        menu: () => ({}),
      }}
      components={{ IndicatorSeparator: () => null }}
      hideSelectedOptions={false}
      isSearchable={false}
      unstyled
      {...props}
    />
  );
};

export default Select;
