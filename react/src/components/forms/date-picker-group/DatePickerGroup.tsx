import { Dispatch, FC, SetStateAction } from "react";
import { DatePicker, Label } from "..";

type Props = {
  value: Date | null;
  setValue: Dispatch<SetStateAction<Date | null>>;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
};

const DatePickerGroup: FC<Props> = ({ label, error, className, ...props }) => {
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
      <DatePicker {...props} />
    </div>
  );
};

export default DatePickerGroup;
