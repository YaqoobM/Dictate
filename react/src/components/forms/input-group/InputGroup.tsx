import { Dispatch, FC, SetStateAction } from "react";
import { Input, Label } from "..";

type Props = {
  id: string;
  name: string;
  type: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
};

const InputGroup: FC<Props> = ({ label, error, className, ...props }) => {
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
      ) : (
        ""
      )}
      <Input {...props} />
    </div>
  );
};

export default InputGroup;
