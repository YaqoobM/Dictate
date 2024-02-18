import { useState } from "react";
import { Modal } from ".";

const useModal = (hide: boolean = true) => {
  const [hidden, setHidden] = useState<boolean>(hide);

  return { Modal, hidden, setHidden };
};

export default useModal;
