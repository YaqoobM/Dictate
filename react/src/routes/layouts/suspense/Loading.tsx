import { FC } from "react";
import { Loader } from "../../../assets/icons/utils";

const Loading: FC = () => {
  return (
    <div className="flex w-full items-center justify-center gap-x-4">
      <Loader
        className="animate-spin stroke-amber-500 dark:stroke-amber-300"
        height="26"
      />
      <h1>Please Wait...</h1>
    </div>
  );
};

export default Loading;
