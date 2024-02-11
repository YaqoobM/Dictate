import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Error as ErrorIcon,
  Success as SuccessIcon,
} from "../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../assets/icons/utils";
import { InputGroup } from "../../../components/forms";
import { Button } from "../../../components/utils";
import { useModal } from "../../../hooks/components";
import { useCreateMeeting } from "../../../hooks/meetings";

type Props = {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const CreateMeetingModal: FC<Props> = ({ hidden, setHidden }) => {
  const { Modal } = useModal();
  const navigate = useNavigate();

  const { create, reset, isPending, isSuccess, isError, error } =
    useCreateMeeting();

  const handleJoinMeeting = () => {
    create(
      {},
      {
        onSuccess: ({ data }) => {
          navigate(`/meeting/${data.id}`);
        },
      },
    );
  };

  useEffect(() => {
    if (hidden === true && (isSuccess || isError)) {
      reset();
    }
  }, [hidden]);

  return (
    <Modal
      className="w-full max-w-xs p-5 sm:max-w-lg lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <h1 className="mb-1 flex flex-row items-center gap-x-3">
        <span className="text-3xl font-semibold tracking-tight text-amber-500 dark:text-amber-300">
          Start New Meeting
        </span>
        {isPending ? (
          <LoadingIcon
            className="animate-spin stroke-amber-500 dark:stroke-amber-300"
            height="26"
          />
        ) : isError ? (
          <ErrorIcon className="stroke-red-600" height="26" />
        ) : isSuccess ? (
          <SuccessIcon className="stroke-green-600" height="26" />
        ) : (
          ""
        )}
      </h1>
      {error ? (
        <p className="text-sm font-medium capitalize text-red-500">
          {(error.data && Object.values(error.data)[0]) ||
            "Something went wrong"}
        </p>
      ) : (
        ""
      )}
      <Button className="mt-2 w-full" onClick={handleJoinMeeting}>
        Go
      </Button>
    </Modal>
  );
};

export default CreateMeetingModal;
