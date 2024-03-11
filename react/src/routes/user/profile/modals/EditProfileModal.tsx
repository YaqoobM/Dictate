import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  Error as ErrorIcon,
  Success as SuccessIcon,
} from "../../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";
import { InputGroup } from "../../../../components/forms";
import { Button } from "../../../../components/utils";
import { useModal } from "../../../../hooks/components";
import { useUpdateProfile } from "../../../../hooks/user";
import { User } from "../../../../types";

type Props = {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

type InputFields = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const EditProfileModal: FC<Props> = ({ hidden, setHidden }) => {
  const [inputFields, setInputFields] = useState<InputFields>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [inputFieldErrors, setInputFieldErrors] = useState<InputFields>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const { Modal } = useModal();

  const { update, reset, isPending, isSuccess, isError, error } =
    useUpdateProfile();

  const handleUpdateProfile = () => {
    if (inputFields.password !== inputFields.confirmPassword) {
      return setInputFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Must match password",
      }));
    } else if (Object.values(inputFields).every((value) => !value)) {
      return setInputFieldErrors((prev) => ({
        ...prev,
        email: "Please update at least 1 field",
      }));
    } else {
      setInputFieldErrors({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
    }

    update(
      {
        email: inputFields.email || undefined,
        username: inputFields.username || undefined,
        password: inputFields.password || undefined,
      },
      { onSuccess: () => setHidden(true) },
    );
  };

  useEffect(() => {
    if (hidden === true) {
      setInputFields({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });

      setInputFieldErrors({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });

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
            Update Profile
          </span>
          {isPending ? (
            <LoadingIcon
              className="animate-spin stroke-amber-500 dark:stroke-amber-300"
              height="26"
            />
          ) : isError || Object.values(inputFieldErrors).some(Boolean) ? (
            <ErrorIcon className="stroke-red-600" height="26" />
          ) : isSuccess ? (
            <SuccessIcon className="stroke-green-600" height="26" />
          ) : null}
        </h1>
        {error ? (
          <p className="text-sm font-medium capitalize text-red-500 lg:col-span-3 lg:text-right">
            {(error?.data && Object.values(error.data)[0]) ||
              "Something went wrong"}
          </p>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <InputGroup
          id="email"
          name="email"
          type="email"
          label="Email"
          error={inputFieldErrors.email}
          value={inputFields.email}
          setValue={(value) => {
            setInputFields((prev) => ({ ...prev, email: value }));
          }}
          placeholder="enter email here..."
        />
        <InputGroup
          id="username"
          name="username"
          type="text"
          label="Username"
          error={inputFieldErrors.username}
          value={inputFields.username}
          setValue={(value) => {
            setInputFields((prev) => ({ ...prev, username: value }));
          }}
          placeholder="enter username here..."
        />
        <InputGroup
          id="password"
          name="password"
          type="password"
          label="Password"
          error={inputFieldErrors.password}
          value={inputFields.password}
          setValue={(value) => {
            setInputFields((prev) => ({ ...prev, password: value }));
          }}
          placeholder="enter password here..."
        />
        <InputGroup
          id="confirm-password"
          name="confirm-password"
          type="password"
          label="Confirm Password"
          error={inputFieldErrors.confirmPassword}
          value={inputFields.confirmPassword}
          setValue={(value) => {
            setInputFields((prev) => ({ ...prev, confirmPassword: value }));
          }}
          placeholder="enter password here..."
        />
        <Button className="mt-2 sm:col-span-2" onClick={handleUpdateProfile}>
          Go
        </Button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
