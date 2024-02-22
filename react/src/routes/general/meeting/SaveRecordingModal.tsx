import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Error as ErrorIcon,
  Success as SuccessIcon,
  Warning as WarningIcon,
} from "../../../assets/icons/symbols";
import { Loader as LoaderIcon } from "../../../assets/icons/utils";
import { useModal } from "../../../hooks/components";

type Props = {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const SaveRecordingModal: FC<Props> = ({
  isPending,
  isSuccess,
  isError,
  reset,
  hidden,
  setHidden,
}) => {
  const { Modal } = useModal();

  useEffect(() => {
    // delay resetting states until modal disappears
    let timeout: NodeJS.Timeout | null = null;

    if (hidden && (isPending || isSuccess || isError)) {
      timeout = setTimeout(() => reset(), 300);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [hidden]);

  return (
    <Modal
      className="flex w-full max-w-xs flex-col gap-y-2 p-5 sm:max-w-lg sm:gap-y-4 lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <h1 className="flex flex-row items-center gap-x-4 text-3xl font-semibold capitalize tracking-tight text-amber-500 dark:text-amber-300">
        {isPending ? (
          <>
            <span>saving recording</span>
            <LoaderIcon className="h-8 animate-spin stroke-amber-500 dark:stroke-amber-300" />
          </>
        ) : isSuccess ? (
          <>
            <span>recording successfully saved</span>
            <SuccessIcon className="h-8 stroke-green-600" />
          </>
        ) : isError ? (
          <>
            <span>an error occurred</span>
            <ErrorIcon className="h-8 stroke-red-600" />
          </>
        ) : (
          <>
            <span>there seems to have been a mistake</span>
            <WarningIcon className="h-7 stroke-amber-500 dark:stroke-amber-300" />
          </>
        )}
      </h1>
      <h2 className="text-base">
        {isPending ? (
          "Please wait while we are processing your recording"
        ) : isSuccess ? (
          <>
            Visit your{" "}
            <Link
              to={"/resources"}
              className="italic text-amber-500 dark:text-amber-300"
            >
              Resources Page
            </Link>{" "}
            to see a complete list of recordings.
          </>
        ) : isError ? (
          "We weren't able to save your recording at this time, please contact us for further information"
        ) : (
          "There seems to be an error on our behalf, you can close this modal"
        )}
      </h2>
    </Modal>
  );
};

export default SaveRecordingModal;
