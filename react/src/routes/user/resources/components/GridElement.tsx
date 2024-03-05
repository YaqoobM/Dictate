import { FC } from "react";
import { ResourceInfo } from "..";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";
import { useGetMonth, useGetSuffix } from "../../../../hooks/calendar";
import { useModal } from "../../../../hooks/components";
import { useGetTeams } from "../../../../hooks/teams";
import { Notes, Recording, User } from "../../../../types";
import { RenameModal } from "../modals";

type Props = {
  resource: (Notes & ResourceInfo) | (Recording & ResourceInfo);
  participants: (User | undefined)[];
  isParticipantsPending: boolean;
  isParticipantsError: boolean;
  key?: string | number;
};

const GridElement: FC<Props> = ({
  resource,
  participants,
  isParticipantsPending,
  isParticipantsError,
  key,
}) => {
  const { hidden: hideRenameModal, setHidden: setHideRenameModal } = useModal();

  const {
    teams,
    isPending: isTeamsPending,
    isError: isTeamsError,
  } = useGetTeams();

  const sampleText =
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi dolores officia commodi sed enim adipisci, sequi, expedita in numquam mollitia explicabo est, esse excepturi atque aliquid ipsum nisi harum quod.";

  const day = parseInt(
    resource.meetingObject.start_time.split(" ")[0].split("/")[0],
  );
  const month =
    parseInt(resource.meetingObject.start_time.split(" ")[0].split("/")[1]) - 1;
  const year = parseInt(
    `20${resource.meetingObject.start_time.split(" ")[0].split("/")[2]}`,
  );

  const start_time = resource.meetingObject.start_time
    .split(" ")[1]
    .split(":")
    .slice(0, 2)
    .join(":");
  const end_time = resource.meetingObject.end_time
    ? resource.meetingObject.end_time
        .split(" ")[1]
        .split(":")
        .slice(0, 2)
        .join(":")
    : null;

  return (
    <div className="flex flex-col gap-y-0.5" key={key}>
      {resource.resource === "notes" ? (
        <div className="group h-32 cursor-pointer rounded bg-gray-500 p-1.5 transition-colors hover:bg-gray-700">
          <div className="relative mx-auto aspect-[4/5] h-full rounded bg-gray-200 shadow transition-transform group-hover:scale-[1.13] dark:shadow-lg">
            <div className="absolute inset-x-2 top-2 text-[5px] capitalize tracking-widest text-gray-950">
              {sampleText.slice(Math.floor(Math.random() * sampleText.length))}
            </div>
          </div>
        </div>
      ) : resource.resource === "recording" && "upload" in resource ? (
        <div
          className={`group flex h-32 items-center justify-center rounded bg-gray-500 p-1.5 transition-colors hover:bg-gray-700 ${resource.upload ? "cursor-pointer" : ""}`}
        >
          {resource.upload ? (
            <video
              className="h-full rounded transition-transform group-hover:scale-[1.13]"
              src={resource.upload}
            />
          ) : (
            <LoadingIcon className="mb-1.5 h-1/4 animate-spin stroke-amber-500 dark:stroke-amber-300" />
          )}
        </div>
      ) : null}
      <h1 className="mb-0.5 mt-1 text-sm leading-none tracking-wide text-amber-500 dark:text-amber-300">
        {resource.title}
      </h1>
      <h1 className="text-xs font-medium uppercase">
        {`${day}${useGetSuffix(day)} ${useGetMonth(month)} ${year}`}
      </h1>
      <h1 className="text-xs font-medium uppercase">
        {`${start_time} - ${end_time ? end_time : <span className="text-amber-500 dark:text-amber-300">ongoing</span>}`}
      </h1>
      <h1
        className="group/join flex w-max cursor-pointer flex-row gap-x-0.5 py-px transition-all hover:gap-x-1"
        onClick={() => setHideRenameModal(false)}
      >
        <span className="text-xs uppercase group-hover/join:text-amber-500 group-hover/join:dark:text-amber-300">
          rename
        </span>
        <span className="text-xs uppercase group-hover/join:text-amber-500 group-hover/join:dark:text-amber-300">
          ?
        </span>
      </h1>
      {resource.meetingObject.team ? (
        <div className="group relative my-0.5 h-4 w-4 rounded-full bg-amber-500 ring-1 ring-gray-300 transition-all hover:mb-0 hover:h-[18px] hover:w-[18px] dark:bg-amber-300 dark:ring-gray-700">
          <p className="pointer-events-none absolute right-1/2 top-[125%] w-max translate-x-1/2 rounded-sm px-2 pb-1.5 pt-1 text-xs text-gray-600 opacity-0 shadow ring-1 ring-gray-300 transition-opacity group-hover:opacity-100 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700">
            {isTeamsPending ? (
              <LoadingIcon className="h-4 animate-spin stroke-amber-500 dark:stroke-amber-300" />
            ) : isTeamsError ? (
              "Something went wrong"
            ) : (
              teams?.find((team) => team.url === resource.meetingObject.team)
                ?.name || "Something went wrong"
            )}
          </p>
        </div>
      ) : (
        <div className="flex flex-row">
          {resource.meetingObject.participants?.map((participant, i) => (
            <div
              className="group relative mb-0.5 h-4 w-4 rounded-full bg-blue-500 ring-1 ring-gray-300 transition-all hover:mb-0 hover:h-[18px] hover:w-[18px] dark:bg-blue-400 dark:ring-gray-700"
              style={{ left: `-${i * 4}px` }}
              key={i}
            >
              <p className="pointer-events-none absolute right-1/2 top-[125%] w-max translate-x-1/2 rounded-sm px-2 pb-1.5 pt-1 text-xs text-gray-600 opacity-0 shadow ring-1 ring-gray-300 transition-opacity group-hover:opacity-100 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700">
                {isParticipantsPending ? (
                  <LoadingIcon className="h-4 animate-spin stroke-amber-500 dark:stroke-amber-300" />
                ) : isParticipantsError ? (
                  "Something went wrong"
                ) : (
                  participants?.find((p) => p?.url === participant)?.username ||
                  "Something went wrong"
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      <RenameModal
        id={resource.id}
        type={resource.resource}
        hidden={hideRenameModal}
        setHidden={setHideRenameModal}
      />
    </div>
  );
};

export default GridElement;
