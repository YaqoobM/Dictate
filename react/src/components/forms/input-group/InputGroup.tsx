import { FC } from "react";
import { Input, Label } from "..";

type Props = {
  id: string;
  name: string;
  type: string;
  value: string;
  setValue: (value: string) => void;
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
      ) : null}
      <Input {...props} />
    </div>
  );
};

export default InputGroup;
