import { FC } from "react";
import { ResourceInfo } from "..";
import { Arrow as ArrowIcon } from "../../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";
import { useGetMonth, useGetSuffix } from "../../../../hooks/calendar";
import { useModal } from "../../../../hooks/components";
import { useGetTeams } from "../../../../hooks/teams";
import { Notes, Recording, User } from "../../../../types";
import { RenameModal, ViewNotesModal, ViewRecordingModal } from "../modals";

type Props = {
  resource: (Notes & ResourceInfo) | (Recording & ResourceInfo);
  participants: (User | undefined)[];
  isParticipantsPending: boolean;
  isParticipantsError: boolean;
};

const GridElement: FC<Props> = ({
  resource,
  participants,
  isParticipantsPending,
  isParticipantsError,
}) => {
  const { hidden: hideRenameModal, setHidden: setHideRenameModal } = useModal();
  const { hidden: hideNotesModal, setHidden: setHideNotesModal } = useModal();
  const { hidden: hideRecordingModal, setHidden: setHideRecordingModal } =
    useModal();

  const {
    teams,
    isPending: isTeamsPending,
    isError: isTeamsError,
  } = useGetTeams();

  const day: number = parseInt(
    resource.meetingObject.start_time.split(" ")[0].split("/")[0],
  );
  const month: number =
    parseInt(resource.meetingObject.start_time.split(" ")[0].split("/")[1]) - 1;
  const year: number = parseInt(
    `20${resource.meetingObject.start_time.split(" ")[0].split("/")[2]}`,
  );
  const start_time: string = resource.meetingObject.start_time
    .split(" ")[1]
    .split(":")
    .slice(0, 2)
    .join(":");
  const end_time: string = resource.meetingObject.end_time
    ? resource.meetingObject.end_time
        .split(" ")[1]
        .split(":")
        .slice(0, 2)
        .join(":")
    : "";

  const uploadAvailable: boolean =
    resource.resource === "recording" &&
    "upload" in resource &&
    Boolean(resource.upload);

  return (
    <div
      id={`${resource.resource}_${resource.id}`}
      className="flex flex-col gap-y-0.5"
    >
      {resource.resource === "notes" ? (
        <div
          className="group h-32 cursor-pointer rounded bg-gray-200 p-1.5 transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700"
          onClick={() => setHideNotesModal(false)}
        >
          <div className="relative mx-auto aspect-[4/5] h-full rounded bg-gray-50 shadow transition-transform group-hover:scale-[1.13] dark:bg-gray-200 dark:shadow-lg">
            <ArrowIcon
              className={`absolute left-1/2 top-1/2 w-1/4 -translate-x-1/2 -translate-y-1/2 ${resource.meetingObject.team ? "stroke-amber-500 dark:stroke-amber-300" : "stroke-blue-500 dark:stroke-blue-400"}`}
            />
          </div>
        </div>
      ) : resource.resource === "recording" && "upload" in resource ? (
        <div
          className={`group flex h-32 items-center justify-center rounded bg-gray-200 p-1.5 transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 ${resource.upload ? "cursor-pointer" : ""}`}
          onClick={() =>
            uploadAvailable ? setHideRecordingModal(false) : null
          }
        >
          {uploadAvailable ? (
            <video
              className="h-full rounded transition-transform group-hover:scale-[1.13]"
              src={resource.upload}
            />
          ) : (
            <LoadingIcon className="mb-1.5 h-1/4 animate-spin stroke-amber-500 dark:stroke-amber-300" />
          )}
        </div>
      ) : null}
      <div className="mb-0.5 mt-1 flex flex-row items-center justify-between gap-x-2">
        <h1 className="text-sm leading-none tracking-wide text-amber-500 dark:text-amber-300">
          {resource.title}
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
                key={participant}
              >
                <p className="pointer-events-none absolute right-1/2 top-[125%] w-max translate-x-1/2 rounded-sm px-2 pb-1.5 pt-1 text-xs text-gray-600 opacity-0 shadow ring-1 ring-gray-300 transition-opacity group-hover:opacity-100 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700">
                  {isParticipantsPending ? (
                    <LoadingIcon className="h-4 animate-spin stroke-amber-500 dark:stroke-amber-300" />
                  ) : isParticipantsError ? (
                    "Something went wrong"
                  ) : (
                    participants?.find((p) => p?.url === participant)
                      ?.username || "Something went wrong"
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <h1 className="text-xs font-medium uppercase">
        {`${day}${useGetSuffix(day)} ${useGetMonth(month)} ${year}`}
      </h1>
      <h1 className="text-xs font-medium uppercase">
        {start_time}
        {" - "}
        {end_time ? (
          end_time
        ) : (
          <span className="animate-pulse text-amber-500 dark:text-amber-300">
            ongoing
          </span>
        )}
      </h1>
      <h1
        className={`group flex w-max flex-row gap-x-1 py-px transition-all hover:gap-x-1.5 ${(resource.resource === "recording" && uploadAvailable) || resource.resource === "notes" ? "cursor-pointer" : null}`}
        onClick={() =>
          resource.resource === "recording"
            ? uploadAvailable
              ? setHideRecordingModal(false)
              : null
            : setHideNotesModal(false)
        }
      >
        {resource.resource === "recording" && !uploadAvailable ? (
          <span className="text-xs uppercase">Loading...</span>
        ) : (
          <>
            <span className="text-xs uppercase group-hover:text-amber-500 group-hover:dark:text-amber-300">
              View
            </span>
            <ArrowIcon className="w-3 stroke-gray-950 group-hover:stroke-amber-500 dark:stroke-gray-100 group-hover:dark:stroke-amber-300" />
          </>
        )}
      </h1>
      <h1
        className="group flex w-max cursor-pointer flex-row gap-x-0.5 py-px transition-all hover:gap-x-1"
        onClick={() => setHideRenameModal(false)}
      >
        <span className="text-xs uppercase group-hover:text-amber-500 group-hover:dark:text-amber-300">
          rename
        </span>
        <span className="text-xs uppercase group-hover:text-amber-500 group-hover:dark:text-amber-300">
          ?
        </span>
      </h1>

      {resource.resource === "notes" && "content" in resource ? (
        <ViewNotesModal
          resource={resource}
          hidden={hideNotesModal}
          setHidden={setHideNotesModal}
        />
      ) : resource.resource === "recording" && "upload" in resource ? (
        <ViewRecordingModal
          resource={resource}
          hidden={hideRecordingModal}
          setHidden={setHideRecordingModal}
        />
      ) : null}

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
