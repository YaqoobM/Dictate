import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Error as ErrorIcon } from "../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../assets/icons/utils";
import { InputGroup } from "../../../components/forms";
import { Button } from "../../../components/utils";
import { useModal } from "../../../hooks/components";
import { useMeeting } from "../../../hooks/meetings";

type Props = {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const JoinMeetingModal: FC<Props> = ({ hidden, setHidden }) => {
  const [meetingId, setMeetingId] = useState<string>("");
  const [meetingIdError, setMeetingIdError] = useState<string>("");

  const { refetch, meeting, isFetching, isSuccess, isError, error } =
    useMeeting(meetingId, false, false);

  const { Modal } = useModal();

  console.log(error);

  const handleJoinMeeting = () => {
    if (!meetingId) {
      return setMeetingIdError("please enter a meeting id");
    } else {
      setMeetingIdError("");
    }

    refetch();
  };

  useEffect(() => {
    if (hidden === true && (meetingIdError || isError)) {
      setMeetingId("");
      setMeetingIdError("");
    }
  }, [hidden]);

  return (
    <Modal
      className="w-full max-w-xs p-5 sm:max-w-lg lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <div className="mb-2 grid w-full grid-cols-1 items-end justify-center gap-x-3 lg:mb-3 lg:grid-cols-8">
        <h1 className="col-span-full mb-3 flex flex-row items-center gap-x-3 lg:col-span-3 lg:mb-0">
          <span className="text-3xl font-semibold tracking-tight text-amber-500 dark:text-amber-300">
            Meeting Id
          </span>
          {isFetching ? (
            <LoadingIcon
              className="animate-spin stroke-amber-500 dark:stroke-amber-300"
              height="26"
            />
          ) : isError || meetingIdError ? (
            <ErrorIcon className="stroke-red-600" height="26" />
          ) : (
            ""
          )}
        </h1>
        {meetingIdError ? (
          <p className="text-sm font-medium capitalize text-red-500 lg:col-span-3 lg:text-right">
            {meetingIdError}
          </p>
        ) : (
          ""
        )}
      </div>
      <div className="grid grid-cols-1 gap-x-3 lg:grid-cols-4">
        <InputGroup
          id="meetingId"
          name="meetingId"
          type="text"
          value={meetingId}
          setValue={setMeetingId}
          placeholder="enter meeting id here..."
          className="lg:col-span-3"
        />
        <Button className="mt-5 lg:mt-0" onClick={handleJoinMeeting}>
          Go
        </Button>
      </div>
    </Modal>
  );
};

export default JoinMeetingModal;
