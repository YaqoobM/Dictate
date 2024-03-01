import { Dispatch, FC, SetStateAction } from "react";
import { Label, Select, SelectOption } from "..";

type Props = {
  value: SelectOption;
  setValue: Dispatch<SetStateAction<SelectOption>>;
  options: SelectOption[];
  label?: string;
  error?: string;
  className?: string;
};

const SelectGroup: FC<Props> = ({ label, error, className, ...props }) => {
  return (
    <div className={className}>
      {label ? (
        <Label>
          {label}
          {error ? (
            <span className="float-right font-medium capitalize leading-tight tracking-tight text-red-500">
              {error}
            </span>
          ) : (
            ""
          )}
        </Label>
      ) : null}
      <Select {...props} />
    </div>
  );
};

export default SelectGroup;
