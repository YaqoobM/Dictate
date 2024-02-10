import { useState } from "react";
import { Modal } from ".";

const useModal = () => {
  const [hidden, setHidden] = useState<boolean>(true);

  return { Modal, hidden, setHidden };
};

export default useModal;
