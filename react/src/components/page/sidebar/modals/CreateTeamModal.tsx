import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  Error as ErrorIcon,
  Success as SuccessIcon,
} from "../../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";
import { InputGroup } from "../../../../components/forms";
import { Button } from "../../../../components/utils";
import { useModal } from "../../../../hooks/components";
import { useCreateTeam } from "../../../../hooks/teams";

type Props = {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const CreateTeamModal: FC<Props> = ({ hidden, setHidden }) => {
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const { Modal } = useModal();

  const { create, reset, isPending, isSuccess, isError } = useCreateTeam();

  const handleSubmit = () => {
    if (!name) {
      return setNameError("please enter a team name.");
    } else {
      setNameError("");
    }

    create({ name }, { onSuccess: () => setHidden(true) });
  };

  useEffect(() => {
    if (hidden === true) {
      if (name) {
        setName("");
      }
      if (nameError) {
        setNameError("");
      }
      reset();
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
            Create Team
          </span>
          {isPending ? (
            <LoadingIcon
              className="animate-spin stroke-amber-500 dark:stroke-amber-300"
              height="26"
            />
          ) : isError || nameError ? (
            <ErrorIcon className="stroke-red-600" height="26" />
          ) : isSuccess ? (
            <SuccessIcon className="stroke-green-600" height="26" />
          ) : (
            ""
          )}
        </h1>
        {nameError || isError ? (
          <p className="text-sm font-medium capitalize text-red-500 lg:col-span-3 lg:text-right">
            {nameError || "Something went wrong"}
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-x-3 lg:grid-cols-4">
        <InputGroup
          id="teamName"
          name="teamName"
          type="text"
          value={name}
          setValue={setName}
          placeholder="enter team name here..."
          className="lg:col-span-3"
        />
        <Button className="mt-5 lg:mt-0" onClick={handleSubmit}>
          Go
        </Button>
      </div>
    </Modal>
  );
};

export default CreateTeamModal;
