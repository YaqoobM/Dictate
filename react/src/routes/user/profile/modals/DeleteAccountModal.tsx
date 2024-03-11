import { Dispatch, FC, SetStateAction, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Error as ErrorIcon,
  Success as SuccessIcon,
} from "../../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";
import { Button } from "../../../../components/utils";
import { AuthContext } from "../../../../contexts";
import { useModal } from "../../../../hooks/components";
import { useDeleteProfile } from "../../../../hooks/user";

type Props = {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const DeleteAccountModal: FC<Props> = ({ hidden, setHidden }) => {
  const navigate = useNavigate();

  const { Modal } = useModal();

  const { setIsAuthenticated } = useContext(AuthContext);

  const {
    fn: deleteProfile,
    isPending,
    isSuccess,
    isError,
  } = useDeleteProfile();

  const handleDelete = () => {
    deleteProfile(undefined, {
      onSuccess: () => {
        setIsAuthenticated(false);
        navigate("/home");
      },
    });
  };

  return (
    <Modal
      className="flex w-full max-w-xs flex-col gap-y-2 p-5 sm:max-w-lg sm:gap-y-4 lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <h1 className="flex flex-row gap-x-3 text-3xl font-semibold capitalize tracking-tight text-amber-500 dark:text-amber-300">
        <span>Are you sure?</span>
        {isPending ? (
          <LoadingIcon
            className="animate-spin stroke-amber-500 dark:stroke-amber-300"
            height="26"
          />
        ) : isError ? (
          <ErrorIcon className="stroke-red-600" height="26" />
        ) : isSuccess ? (
          <SuccessIcon className="stroke-green-600" height="26" />
        ) : null}
      </h1>
      <Button className="w-full" onClick={handleDelete}>
        Delete Account
      </Button>
    </Modal>
  );
};

export default DeleteAccountModal;
