import { useQueries } from "@tanstack/react-query";
import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Arrow as ArrowIcon,
  Info as InfoIcon,
} from "../../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../../assets/icons/utils";
import { useModal } from "../../../../hooks/components";
import { useGetTeams } from "../../../../hooks/teams";
import { useGetUserFn } from "../../../../hooks/user";
import { Meeting } from "../../../../types";
import { days, getDateSuffix, months } from "../helpers";
import { UpdateMeetingModal } from "../modals";

type Props = {
  day: Date | null;
  meetings: Meeting[];
};

const Schedule: FC<Props> = ({ day, meetings }) => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const navigate = useNavigate();
  const now: Date = new Date();

  const {
    teams,
    isPending: isTeamsPending,
    isError: isTeamsError,
  } = useGetTeams();

  const participants = useQueries({
    queries: meetings
      .reduce<string[]>((accumulator, value) => {
        if (!value.team && value.participants) {
          return [
            ...accumulator,
            ...value.participants.filter((p) => !accumulator.includes(p)),
          ];
        }
        return [...accumulator];
      }, [])
      .map((participant) => {
        const id = participant.split("/").slice(-2, -1)[0];

        return {
          queryKey: ["user", id],
          queryFn: () => useGetUserFn(participant.split("/").slice(-2, -1)[0]),
          //         1 min
          staleTime: 1 * 60 * 1000,
        };
      }),
  });
  const isParticipantsPending = participants.some(
    (participant) => participant.isPending,
  );
  const isParticipantsError = participants.some(
    (participant) => participant.isError,
  );

  const {
    hidden: hideUpdateMeetingModal,
    setHidden: setHideUpdateMeetingModal,
  } = useModal();

  const isMeetingAvailable: (meeting: Meeting) => boolean = (meeting) => {
    if (!meeting.end_time) {
      return true;
    }

    let start = new Date(
      parseInt(meeting.start_time.split(" ")[0].split("/")[2]),
      parseInt(meeting.start_time.split(" ")[0].split("/")[1]) - 1,
      parseInt(meeting.start_time.split(" ")[0].split("/")[0]),
      parseInt(meeting.start_time.split(" ")[1].split(":")[0]),
      parseInt(meeting.start_time.split(" ")[1].split(":")[1]),
      parseInt(meeting.start_time.split(" ")[1].split(":")[2]),
    );

    let end = new Date(
      parseInt(meeting.end_time.split(" ")[0].split("/")[2]),
      parseInt(meeting.end_time.split(" ")[0].split("/")[1]) - 1,
      parseInt(meeting.end_time.split(" ")[0].split("/")[0]),
      parseInt(meeting.end_time.split(" ")[1].split(":")[0]),
      parseInt(meeting.end_time.split(" ")[1].split(":")[1]),
      parseInt(meeting.end_time.split(" ")[1].split(":")[2]),
    );

    if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
      return true;
    }

    return false;
  };

  const isMeetingInTheFuture: (meeting: Meeting) => boolean = (meeting) => {
    if (!meeting.end_time) {
      return false;
    }

    let start = new Date(
      parseInt(meeting.start_time.split(" ")[0].split("/")[2]),
      parseInt(meeting.start_time.split(" ")[0].split("/")[1]) - 1,
      parseInt(meeting.start_time.split(" ")[0].split("/")[0]),
      parseInt(meeting.start_time.split(" ")[1].split(":")[0]),
      parseInt(meeting.start_time.split(" ")[1].split(":")[1]),
      parseInt(meeting.start_time.split(" ")[1].split(":")[2]),
    );

    if (now.getTime() <= start.getTime()) {
      return true;
    }

    return false;
  };

  const handleJoinMeeting: (meeting: Meeting) => void = (meeting) => {
    navigate(`/meeting/${meeting.id}`);
  };

  const handleUpdateMeeting: (meeting: Meeting) => void = (meeting) => {
    setSelectedMeeting(meeting);
    setHideUpdateMeetingModal(false);
  };

  return (
    <>
      <div className="mt-3 flex flex-col gap-y-2">
        {day ? (
          <>
            <h1 className="text-lg font-medium capitalize">{`${days[day.getDay()]} ${day.getDate()}${getDateSuffix(day.getDate())} ${months[day.getMonth()]} ${day.getFullYear()}`}</h1>
            <div className="h-0.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            {meetings.length === 0 ? (
              <h1 className="mt-1 text-base font-medium capitalize">
                No meetings found...
              </h1>
            ) : (
              meetings.map((meeting, i) => (
                <div
                  className="group/meeting mt-1 flex flex-col gap-y-1"
                  key={i}
                >
                  <div className="flex flex-row items-center justify-between">
                    <h1 className="flex flex-row items-center gap-x-1.5 font-medium">
                      <span>
                        {meeting.start_time
                          .split(" ")[1]
                          .split(":")
                          .slice(0, 2)
                          .join(":")}
                      </span>
                      <span>-</span>
                      {meeting.end_time ? (
                        <span>
                          {meeting.end_time
                            .split(" ")[1]
                            .split(":")
                            .slice(0, 2)
                            .join(":")}
                        </span>
                      ) : null}
                      {isMeetingAvailable(meeting) ? (
                        <span className="animate-pulse text-amber-500 dark:text-amber-300">
                          ongoing
                        </span>
                      ) : null}
                    </h1>
                    <div className="relative">
                      {meeting.team ? (
                        <div className="absolute right-0 top-0 -translate-y-1/2">
                          <p className="peer h-4 w-4 rounded-full bg-amber-500 ring-1 ring-gray-300 transition-all hover:h-[18px] hover:w-[18px] dark:bg-amber-300 dark:ring-gray-700" />
                          <p className="absolute right-[9px] top-[125%] w-max translate-x-1/2 rounded-sm px-2 py-1 text-xs text-gray-600 opacity-0 shadow ring-1 ring-gray-300 transition-opacity peer-hover:opacity-100 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700">
                            {isTeamsPending ? (
                              <LoadingIcon className="h-4 animate-spin stroke-amber-500 dark:stroke-amber-300" />
                            ) : isTeamsError ? (
                              "Something went wrong"
                            ) : (
                              teams?.find((team) => team.url === meeting.team)
                                ?.name || "Something went wrong"
                            )}
                          </p>
                        </div>
                      ) : (
                        meeting.participants?.map((participant, i) => (
                          <div
                            className="absolute top-0 -translate-y-1/2"
                            style={{ right: `${i * 8}px` }}
                            key={i}
                          >
                            <p className="peer h-4 w-4 rounded-full bg-blue-500 ring-1 ring-gray-300 transition-all hover:h-[18px] hover:w-[18px] dark:bg-blue-400 dark:ring-gray-700" />
                            <p className="absolute right-[9px] top-[125%] w-max translate-x-1/2 rounded-sm px-2 py-1 text-xs text-gray-600 opacity-0 shadow ring-1 ring-gray-300 transition-opacity peer-hover:opacity-100 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700">
                              {isParticipantsPending ? (
                                <LoadingIcon className="h-4 animate-spin stroke-amber-500 dark:stroke-amber-300" />
                              ) : isParticipantsError ? (
                                "Something went wrong"
                              ) : (
                                participants?.find(
                                  (p) => p.data?.url === participant,
                                )?.data?.username || "Something went wrong"
                              )}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <p
                    className="group/join flex w-max cursor-pointer flex-row gap-x-1 py-px text-sm font-medium uppercase transition-all hover:gap-x-2"
                    onClick={() => handleJoinMeeting(meeting)}
                  >
                    <span className="group-hover/join:text-amber-500 group-hover/join:dark:text-amber-300">
                      join now
                    </span>
                    <ArrowIcon className="w-4 stroke-gray-950 group-hover/join:stroke-amber-500 dark:stroke-gray-100 group-hover/join:dark:stroke-amber-300" />
                  </p>
                  {isMeetingInTheFuture(meeting) ? (
                    <p
                      className="group/join flex w-max cursor-pointer flex-row gap-x-1 py-px text-sm font-medium uppercase transition-all hover:gap-x-2"
                      onClick={() => handleUpdateMeeting(meeting)}
                    >
                      <span className="group-hover/join:text-amber-500 group-hover/join:dark:text-amber-300">
                        update times
                      </span>
                      <ArrowIcon className="w-4 stroke-gray-950 group-hover/join:stroke-amber-500 dark:stroke-gray-100 group-hover/join:dark:stroke-amber-300" />
                    </p>
                  ) : null}
                  <p>
                    {meeting.recordings.length > 0
                      ? meeting.recordings.length
                      : "No"}{" "}
                    <Link
                      className="text-amber-500 dark:text-amber-300"
                      to="/resources"
                    >
                      {meeting.recordings.length === 1
                        ? "recording"
                        : "recordings"}
                    </Link>{" "}
                    {meeting.recordings.length > 0 ? "available" : "saved"}
                  </p>
                  <p>
                    {meeting.notes ? "Meeting " : "No "}
                    <Link
                      className="text-amber-500 dark:text-amber-300"
                      to="/resources"
                    >
                      notes
                    </Link>
                    {meeting.notes ? " available" : " saved"}
                  </p>
                  <div className="mt-1 h-0.5 rounded-full bg-gray-300 group-last/meeting:hidden dark:bg-gray-700" />
                </div>
              ))
            )}
          </>
        ) : (
          <h1 className="flex flex-row items-center gap-x-1">
            <InfoIcon className="w-8 stroke-amber-500 dark:stroke-amber-300" />
            <span className="text-base font-medium capitalize">
              select a day for further information
            </span>
          </h1>
        )}
      </div>

      <UpdateMeetingModal
        meeting={selectedMeeting}
        hidden={hideUpdateMeetingModal}
        setHidden={setHideUpdateMeetingModal}
      />
    </>
  );
};

export default Schedule;
