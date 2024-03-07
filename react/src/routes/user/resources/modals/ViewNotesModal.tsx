import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { useModal } from "../../../../hooks/components";

import Checklist from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Marker from "@editorjs/marker";
import NestedList from "@editorjs/nested-list";
import Paragraph from "@editorjs/paragraph";
import Table from "@editorjs/table";
import { ResourceInfo } from "..";
import { Notes } from "../../../../types";

type Props = {
  resource: Notes & ResourceInfo;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
};

const ViewNotesModal: FC<Props> = ({ resource, hidden, setHidden }) => {
  const { Modal } = useModal();
  const isReady = useRef<boolean>(false);

  useEffect(() => {
    if (!isReady.current) {
      new EditorJS({
        holder: `editorjs-${resource.id}`,
        data: JSON.parse(resource.content),
        tools: {
          paragraph: Paragraph,
          header: Header,
          delimiter: Delimiter,
          list: NestedList,
          checklist: Checklist,
          table: Table,
          marker: Marker,
        },
        defaultBlock: "embed",
        readOnly: true,
      });

      isReady.current = true;
    }
  }, []);

  return (
    <Modal
      className="!top-[10%] !mb-[20vh] w-full max-w-xs sm:max-w-lg lg:max-w-2xl"
      styled={false}
      closeClassName="!stroke-gray-950 hover:!stroke-amber-500 dark:hover:!stroke-amber-300"
      hidden={hidden}
      setHidden={setHidden}
    >
      <div className="rounded-md bg-gray-50 py-10 text-gray-950 shadow dark:bg-gray-200 dark:shadow-lg">
        <div
          id={`editorjs-${resource.id}`}
          className="editorjs mx-auto w-[calc(100%-100px)]"
        />
      </div>
    </Modal>
  );
};

export default ViewNotesModal;
