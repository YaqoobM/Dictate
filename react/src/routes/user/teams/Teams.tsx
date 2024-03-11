import { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Arrow as ArrowIcon,
  Error as ErrorIcon,
} from "../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../assets/icons/utils";
import { Select, SelectOption } from "../../../components/forms";
import { useGetMeetings } from "../../../hooks/meetings";
import { useGetNotes, useGetRecordings } from "../../../hooks/resources";
import { useGetTeams } from "../../../hooks/teams";
import { useGetUsers } from "../../../hooks/user";
import { Meeting, Team } from "../../../types";

const Teams: FC = () => {
  const defaultOption: SelectOption = {
    label: "Loading",
    value: "loading",
    disabled: true,
  };

  const [teamFilter, setTeamFilter] = useState<SelectOption>(defaultOption);

  const navigate = useNavigate();

  const {
    teams,
    isPending: isTeamsPending,
    isSuccess: isTeamsSuccess,
    isError: isTeamsError,
  } = useGetTeams();

  const {
    meetings,
    isPending: isMeetingsPending,
    isError: isMeetingsError,
  } = useGetMeetings();

  const { recordings, isPending: isRecordingsPending } = useGetRecordings();

  const { notes, isPending: isNotesPending } = useGetNotes();

  const {
    users,
    isPending: isUsersPending,
    isError: isUsersError,
  } = useGetUsers(
    teams
      ?.find((team) => team.id === teamFilter.value)
      ?.members.map((url) => url.split("/").slice(-2, -1)[0]) || [],
  );

  const sortedMeetings: Meeting[] = useMemo(() => {
    if (!meetings) {
      return [];
    }

    return meetings.sort((a, b) => {
      if (!b.end_time) {
        return 1;
      }

      if (!a.end_time) {
        return -1;
      }

      const aDate = new Date(
        parseInt(`20${a.start_time.split(" ")[0].split("/")[2]}`),
        parseInt(a.start_time.split(" ")[0].split("/")[1]) - 1,
        parseInt(a.start_time.split(" ")[0].split("/")[0]),
        parseInt(a.start_time.split(" ")[1].split(":")[0]),
        parseInt(a.start_time.split(" ")[1].split(":")[1]),
        parseInt(a.start_time.split(" ")[1].split(":")[2]),
      );

      const bDate = new Date(
        parseInt(`20${b.start_time.split(" ")[0].split("/")[2]}`),
        parseInt(b.start_time.split(" ")[0].split("/")[1]) - 1,
        parseInt(b.start_time.split(" ")[0].split("/")[0]),
        parseInt(b.start_time.split(" ")[1].split(":")[0]),
        parseInt(b.start_time.split(" ")[1].split(":")[1]),
        parseInt(b.start_time.split(" ")[1].split(":")[2]),
      );

      // DESC
      return bDate.getTime() - aDate.getTime();
    });
  }, [meetings]);

  const options: SelectOption[] = useMemo(() => {
    const array = [];

    if (isTeamsPending) {
      array.push(defaultOption);
    } else if (isTeamsError || !teams) {
      array.push({
        label: "Something went wrong...",
        value: "error",
        disabled: true,
      });
    } else if (teams.length === 0) {
      array.push({
        label: "No teams available...",
        value: "no teams",
        disabled: true,
      });
    } else {
      array.push(
        ...teams.map((team) => ({ label: team.name, value: team.id })),
      );
    }

    return array;
  }, [teams, isTeamsPending]);

  let meetingCounter = 0;

  useEffect(() => {
    if (teams && options) {
      setTeamFilter(options[0]);
    }
  }, [isTeamsSuccess]);

  const team: Team | null =
    teams?.find((team) => team.id === teamFilter.value) || null;

  return (
    <div className="px-6 py-1.5">
      <div className="mb-3 flex flex-col justify-between gap-y-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-x-4">
          <Select
            value={teamFilter}
            setValue={setTeamFilter}
            options={options}
            inputBox={false}
            dropdownClass="min-w-max w-screen max-w-32"
          />
          {isTeamsPending ? (
            <LoadingIcon
              className="animate-spin stroke-amber-500 dark:stroke-amber-300"
              height="26"
            />
          ) : isTeamsError ? (
            <h2 className="flex items-center gap-x-2">
              <ErrorIcon className="stroke-red-600" height="26" />
              <span className="tracking-tight text-red-600">
                Something went wrong finding your meetings
              </span>
            </h2>
          ) : null}
        </div>
        {team ? (
          <h1 className="text-lg font-medium text-amber-500 dark:text-amber-300">
            Team Id: #{team.id}
          </h1>
        ) : null}
      </div>
      <div className="flex flex-col justify-center gap-2 gap-x-10 lg:flex-row 2xl:gap-x-20">
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col gap-y-2 rounded-lg bg-gray-700 p-5">
            <h1 className="flex flex-row items-center gap-x-2">
              <span>Meetings:</span>
              {team ? (
                <span>{team.meetings.length}</span>
              ) : isTeamsPending ? (
                <LoadingIcon className="h-5 animate-spin stroke-amber-500 dark:stroke-amber-300" />
              ) : teamFilter.value === "no teams" ? (
                <span className="text-sm text-amber-500 dark:text-amber-300">
                  No team selected
                </span>
              ) : (
                <>
                  <ErrorIcon className="h-5 stroke-red-600" />
                  <span className="text-sm text-red-600">
                    Something went wrong
                  </span>
                </>
              )}
            </h1>
            <h1 className="flex flex-row items-center gap-x-2">
              <span>Recordings:</span>
              {team && recordings ? (
                <span>
                  {
                    recordings.filter((recording) =>
                      team.meetings.includes(recording.meeting),
                    ).length
                  }
                </span>
              ) : isRecordingsPending ? (
                <LoadingIcon className="h-5 animate-spin stroke-amber-500 dark:stroke-amber-300" />
              ) : teamFilter.value === "no teams" ? (
                <span className="text-sm text-amber-500 dark:text-amber-300">
                  No team selected
                </span>
              ) : (
                <>
                  <ErrorIcon className="h-5 stroke-red-600" />
                  <span className="text-sm text-red-600">
                    Something went wrong
                  </span>
                </>
              )}
            </h1>
            <h1 className="flex flex-row items-center gap-x-2">
              <span>Notes:</span>
              {team && notes ? (
                <span>
                  {
                    notes.filter((note) => team.meetings.includes(note.meeting))
                      .length
                  }
                </span>
              ) : isNotesPending ? (
                <LoadingIcon className="h-5 animate-spin stroke-amber-500 dark:stroke-amber-300" />
              ) : teamFilter.value === "no teams" ? (
                <span className="text-sm text-amber-500 dark:text-amber-300">
                  No team selected
                </span>
              ) : (
                <>
                  <ErrorIcon className="h-5 stroke-red-600" />
                  <span className="text-sm text-red-600">
                    Something went wrong
                  </span>
                </>
              )}
            </h1>
          </div>
          <div className="mb-5 mt-7">
            <h1 className="flex flex-row items-center gap-x-3">
              <span className="text-lg tracking-wide">Members</span>
              {team ? (
                <span className="text-lg tracking-wide">
                  ({team.members.length})
                </span>
              ) : isTeamsPending ? (
                <LoadingIcon className="h-6 animate-spin stroke-amber-500 dark:stroke-amber-300" />
              ) : teamFilter.value === "no teams" ? (
                <span className="text-sm text-amber-500 dark:text-amber-300">
                  No team selected
                </span>
              ) : (
                <>
                  <ErrorIcon className="h-6 stroke-red-600" />
                  <span className="text-sm text-red-600">
                    Something went wrong
                  </span>
                </>
              )}
            </h1>
            {team?.members.map((url) => {
              if (isUsersPending) {
                return (
                  <div className="my-2 flex flex-row items-center gap-x-3">
                    <LoadingIcon className="h-8 animate-spin stroke-amber-500 dark:stroke-amber-300" />
                    <p className="text-amber-500 dark:text-amber-300">
                      Loading team members
                    </p>
                  </div>
                );
              }

              if (isUsersError || users.some((user) => !user)) {
                return (
                  <div className="my-2 flex flex-row items-center gap-x-3">
                    <ErrorIcon className="h-8 stroke-red-600" />
                    <span className="text-red-600">
                      Something went wrong getting profiles
                    </span>
                  </div>
                );
              }

              const member = users.find((user) => user!.url === url);

              if (!member) {
                return (
                  <>
                    <ErrorIcon className="h-10 stroke-red-600" />
                    <span className="text-sm text-red-600">
                      Something went wrong
                    </span>
                  </>
                );
              }

              return (
                <hgroup className="mt-1 flex flex-col gap-y-0" key={member.id}>
                  <h1 className="text-base font-medium text-amber-500 dark:text-amber-300">
                    {member.username}
                  </h1>
                  <h1 className="text-sm tracking-tight">{member.email}</h1>
                </hgroup>
              );
            })}
          </div>
        </div>
        <div className="w-full self-start lg:w-1/2">
          <h1 className="flex flex-row items-center gap-x-3">
            <span className="text-lg tracking-wide">Upcoming Meetings</span>
            {isMeetingsPending ? (
              <LoadingIcon className="h-6 animate-spin stroke-amber-500 dark:stroke-amber-300" />
            ) : isMeetingsError ? (
              <>
                <ErrorIcon className="h-6 stroke-red-600" />
                <span className="text-sm text-red-600">
                  Something went wrong
                </span>
              </>
            ) : null}
          </h1>
          <div className="mt-2">
            {sortedMeetings.length === 0 ? (
              <span className="text-sm text-amber-500 dark:text-amber-300">
                No team selected
              </span>
            ) : (
              sortedMeetings
                ?.filter((meeting) => meeting.team === team?.url)
                .filter((meeting) => {
                  if (!meeting.end_time) {
                    return true;
                  }

                  if (meetingCounter < 3) {
                    meetingCounter++;
                    return true;
                  }

                  return false;
                })
                .map((meeting) => (
                  <div
                    className="my-3 flex flex-col gap-y-0.5"
                    key={meeting.id}
                  >
                    <h1 className="flex flex-row gap-x-2 font-medium tracking-wide text-amber-500 dark:text-amber-300">
                      <span>{meeting.start_time.split(" ")[0]}</span>
                      <span>|</span>
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
                      ) : (
                        <span className="animate-pulse">ongoing</span>
                      )}
                    </h1>
                    <p
                      className="group flex w-max cursor-pointer flex-row gap-x-1 py-px text-[15px] transition-all hover:gap-x-2"
                      onClick={() => navigate("/calendars")}
                    >
                      <span className="group-hover:text-amber-500 group-hover:dark:text-amber-300">
                        View Calendar
                      </span>
                      <ArrowIcon className="w-4 stroke-gray-950 group-hover:stroke-amber-500 dark:stroke-gray-100 group-hover:dark:stroke-amber-300" />
                    </p>
                    <p
                      className="group flex w-max cursor-pointer flex-row gap-x-1 py-px text-[15px] transition-all hover:gap-x-2"
                      onClick={() => navigate(`/meeting/${meeting.id}`)}
                    >
                      <span className="group-hover:text-amber-500 group-hover:dark:text-amber-300">
                        Join Meeting
                      </span>
                      <ArrowIcon className="w-4 stroke-gray-950 group-hover:stroke-amber-500 dark:stroke-gray-100 group-hover:dark:stroke-amber-300" />
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
