import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  Error as ErrorIcon,
  Success as SuccessIcon,
} from "../../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";
import { InputGroup } from "../../../../components/forms";
import { Button } from "../../../../components/utils";
import { useModal } from "../../../../hooks/components";
import {
  useRenameNotes,
  useRenameRecording,
} from "../../../../hooks/resources";

type Props = {
  type: "recording" | "notes";
  id: string;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const RenameModal: FC<Props> = ({ type, id, hidden, setHidden }) => {
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const { Modal } = useModal();

  const {
    patch: patchRecording,
    reset: resetRecording,
    isPending: isRecordingPending,
    isError: isRecordingError,
  } = useRenameRecording();

  const {
    patch: patchNotes,
    reset: resetNotes,
    isPending: isNotesPending,
    isError: isNotesError,
  } = useRenameNotes();

  const handleSubmit = () => {
    if (!name) {
      return setNameError("please enter a name.");
    } else {
      setNameError("");
    }

    if (type === "recording") {
      patchRecording(
        { id, newName: name },
        { onSuccess: () => setHidden(true) },
      );
    } else if (type === "notes") {
      patchNotes({ id, newName: name }, { onSuccess: () => setHidden(true) });
    }
  };

  useEffect(() => {
    if (hidden === true) {
      if (name) {
        setName("");
      }

      if (nameError) {
        setNameError("");
      }

      resetRecording();
      resetNotes();
    }
  }, [hidden]);

  return (
    <Modal
      className="w-full max-w-xs p-5 sm:max-w-lg lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <div className="mb-2 grid w-full grid-cols-1 items-end justify-center gap-x-3 lg:mb-3 lg:grid-cols-8">
        <h1 className="col-span-full mb-3 flex flex-row items-center gap-x-3 lg:col-span-4 lg:mb-0">
          <span className="text-3xl font-semibold tracking-tight text-amber-500 dark:text-amber-300">
            Rename Resource
          </span>
          {isRecordingPending || isNotesPending ? (
            <LoadingIcon
              className="animate-spin stroke-amber-500 dark:stroke-amber-300"
              height="26"
            />
          ) : isRecordingError || isNotesError || nameError ? (
            <ErrorIcon className="stroke-red-600" height="26" />
          ) : null}
        </h1>
        {nameError || isRecordingError || isNotesError ? (
          <p className="text-sm font-medium capitalize text-red-500 lg:col-span-4 lg:text-right">
            {nameError || "Something went wrong"}
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-x-3 lg:grid-cols-4">
        <InputGroup
          id="name"
          name="name"
          type="text"
          value={name}
          setValue={setName}
          placeholder="enter new name here..."
          className="lg:col-span-3"
        />
        <Button className="mt-5 lg:mt-0" onClick={handleSubmit}>
          Go
        </Button>
      </div>
    </Modal>
  );
};

export default RenameModal;
