import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { InputGroup } from "../../../../components/forms";
import { Button } from "../../../../components/utils";
import { useModal } from "../../../../hooks/components";

type Props = {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
  websocket: MutableRefObject<WebSocket | null>;
};

const SetUsernameModal: FC<Props> = ({ websocket, hidden, setHidden }) => {
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");

  const { Modal } = useModal();

  const handleSetUsername = () => {
    if (!username) {
      return setUsernameError("please enter a username.");
    } else {
      setUsernameError("");
    }

    if (websocket.current) {
      websocket.current.send(
        JSON.stringify({ type: "set_username", username }),
      );
    }

    setHidden(true);
  };

  useEffect(() => {
    if (hidden === true) {
      if (username) {
        setUsername("");
      }

      if (usernameError) {
        setUsernameError("");
      }
    }
  }, [hidden]);

  return (
    <Modal
      className="w-full max-w-xs p-5 sm:max-w-lg lg:max-w-2xl"
      hidden={hidden}
      setHidden={setHidden}
    >
      <div className="mb-2 grid grid-cols-1 items-end lg:mb-3 lg:grid-cols-8">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-amber-500 dark:text-amber-300 lg:col-span-5 lg:mb-0">
          Set Username For Meeting
        </h1>
        <p className="text-right text-sm font-medium capitalize text-red-500 lg:col-span-3">
          {usernameError}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-x-3 lg:grid-cols-4">
        <InputGroup
          id="username"
          name="username"
          type="text"
          value={username}
          setValue={setUsername}
          placeholder="enter username here..."
          className="lg:col-span-3"
        />
        <Button className="mt-5 lg:mt-0" onClick={handleSetUsername}>
          Go
        </Button>
      </div>
    </Modal>
  );
};

export default SetUsernameModal;
