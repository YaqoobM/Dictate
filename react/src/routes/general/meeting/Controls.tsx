import { FC } from "react";
import { Exit as ExitIcon } from "../../../assets/icons/buttons";
import {
  Chat as ChatIcon,
  Record as RecordIcon,
} from "../../../assets/icons/meetings-controls";
import { Info as InfoIcon } from "../../../assets/icons/symbols";

const Controls: FC = () => {
  return (
    <>
      <article className="fixed bottom-[10%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-row items-center gap-x-4 rounded-3xl bg-gray-300 px-4 py-3 text-gray-950 opacity-30 hover:opacity-100 dark:bg-gray-700 dark:text-gray-100 lg:bottom-[5%]">
        <InfoIcon className="h-[50px] cursor-pointer stroke-gray-950 dark:stroke-gray-100 dark:hover:stroke-amber-300" />
        <ChatIcon className="h-[50px] cursor-pointer stroke-gray-950 dark:stroke-gray-100 dark:hover:stroke-amber-300" />
        <RecordIcon
          height="35"
          className="mx-[7px] cursor-pointer stroke-gray-950 dark:stroke-gray-100 dark:hover:stroke-amber-300"
        />
        <ExitIcon
          height="35"
          className="ml-1 mr-2 cursor-pointer stroke-gray-950 dark:stroke-gray-100 dark:hover:stroke-amber-300"
        />
      </article>
      {/* InfoModal */}
      {/* StartRecording?Modal */}
      {/* Exit?Modal */}
    </>
  );
};

export default Controls;
