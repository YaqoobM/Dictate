import { Dispatch, FC, SetStateAction, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Error as ErrorIcon,
  Success as SuccessIcon,
  Warning as WarningIcon,
} from "../../../../assets/icons/symbols";
import { Loader as LoaderIcon } from "../../../../assets/icons/utils";
import { Button } from "../../../../components/utils";
import { AuthContext } from "../../../../contexts";
import { useModal } from "../../../../hooks/components";

type Props = {
  recording: boolean;
  setRecording: Dispatch<SetStateAction<boolean>>;
  recordingStates: {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error?: string;
  };
  recorder: MediaRecorder | null;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const RecordingModal: FC<Props> = ({
  recording,
  setRecording,
  recordingStates,
  recorder,
  hidden,
  setHidden,
}) => {
  const { isAuthenticated } = useContext(AuthContext);
  const { Modal } = useModal();

  const handleSubmit = () => {
    if (recording) {
      recorder?.stop();
    } else {
      setRecording(true);
    }
  };

  useEffect(() => {
    if (recordingStates.isSuccess || (!recording && !recordingStates.isError)) {
      setHidden(true);
    }
  }, [recording, recordingStates.isSuccess]);

  return (
    <Modal
      className="flex w-full max-w-xs flex-col gap-y-2 p-5 sm:max-w-lg sm:gap-y-4 lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      {isAuthenticated ? (
        <>
          <h1 className="flex flex-col items-center gap-x-4 text-3xl font-semibold capitalize tracking-tight text-amber-500 dark:text-amber-300 sm:flex-row">
            <span>
              {recordingStates.isPending
                ? "loading"
                : recording
                  ? "stop recording?"
                  : "start recording?"}
            </span>
            {recordingStates.isPending ? (
              <LoaderIcon className="h-8 animate-spin stroke-amber-500 dark:stroke-amber-300" />
            ) : recordingStates.isError ? (
              <ErrorIcon className="h-8 stroke-red-600" />
            ) : recordingStates.isSuccess ? (
              <SuccessIcon className="h-8 stroke-green-600" />
            ) : null}
            {recordingStates.isError ? (
              <span className="text-lg font-medium capitalize text-red-500 sm:self-end">
                {recordingStates?.error || "Something went wrong"}
              </span>
            ) : null}
          </h1>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={recordingStates.isPending}
          >
            {recordingStates.isError ? "Try Again" : "Yes"}
          </Button>
        </>
      ) : (
        <>
          <h1 className="flex flex-row items-center gap-x-4 text-3xl font-semibold capitalize tracking-tight text-amber-500 dark:text-amber-300">
            <span>Login required to record session</span>
            <WarningIcon className="h-7 stroke-amber-500 dark:stroke-amber-300" />
          </h1>
          <h2 className="text-base">
            Create an account{" "}
            <Link
              to={"/signup"}
              className="italic text-amber-500 dark:text-amber-300"
            >
              here
            </Link>{" "}
            or{" "}
            <Link
              to={"/login"}
              className="italic text-amber-500 dark:text-amber-300"
            >
              login
            </Link>{" "}
            to access this feature.
          </h2>
        </>
      )}
    </Modal>
  );
};

export default RecordingModal;
