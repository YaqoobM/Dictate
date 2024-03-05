import { useMemo } from "react";
import { FilledResources, ResourceInfo } from "..";
import { SelectOption } from "../../../../components/forms";
import { useGetMeetings, useGetParticipants } from "../../../../hooks/meetings";
import { useGetNotes, useGetRecordings } from "../../../../hooks/resources";
import { useGetTeam, useGetTeams } from "../../../../hooks/teams";
import { Notes, Recording } from "../../../../types";

const useGetFilledResources = (
  teamFilter: SelectOption,
  resourcesFilter: SelectOption,
) => {
  const {
    recordings,
    isPending: isRecordingsPending,
    isError: isRecordingsError,
  } = useGetRecordings();

  const {
    notes,
    isPending: isNotesPending,
    isError: isNotesError,
  } = useGetNotes();

  const {
    meetings,
    isPending: isMeetingsPending,
    isError: isMeetingsError,
  } = useGetMeetings();

  const {
    teams,
    isPending: isTeamsPending,
    isError: isTeamsError,
  } = useGetTeams();

  const {
    team,
    isPending: isTeamPending,
    isError: isTeamError,
  } = useGetTeam(teamFilter.value, teamFilter.value !== "all");

  const {
    participants,
    isPending: isParticipantsPending,
    isError: isParticipantsError,
  } = useGetParticipants(meetings || []);

  const filterAndSortResources: (
    resources: FilledResources,
    teamFilter: SelectOption,
    resourcesFilter: SelectOption,
  ) => FilledResources = (resources, teamFilter, resourcesFilter) => {
    let finalArray = resources;

    if (resourcesFilter.value !== "all") {
      finalArray = finalArray.filter(
        (resource) => resource.resource === resourcesFilter.value,
      );
    }

    if (teamFilter.value !== "all" && team) {
      finalArray = finalArray.filter((resource) =>
        team.meetings.includes(resource.meeting),
      );
    }

    return finalArray.sort((a, b) => {
      const aDate = new Date(
        parseInt(`20${a.meetingObject.start_time.split(" ")[0].split("/")[2]}`),
        parseInt(a.meetingObject.start_time.split(" ")[0].split("/")[1]) - 1,
        parseInt(a.meetingObject.start_time.split(" ")[0].split("/")[0]),
        parseInt(a.meetingObject.start_time.split(" ")[1].split(":")[0]),
        parseInt(a.meetingObject.start_time.split(" ")[1].split(":")[1]),
        parseInt(a.meetingObject.start_time.split(" ")[1].split(":")[2]),
      );

      const bDate = new Date(
        parseInt(`20${b.meetingObject.start_time.split(" ")[0].split("/")[2]}`),
        parseInt(b.meetingObject.start_time.split(" ")[0].split("/")[1]) - 1,
        parseInt(b.meetingObject.start_time.split(" ")[0].split("/")[0]),
        parseInt(b.meetingObject.start_time.split(" ")[1].split(":")[0]),
        parseInt(b.meetingObject.start_time.split(" ")[1].split(":")[1]),
        parseInt(b.meetingObject.start_time.split(" ")[1].split(":")[2]),
      );

      // DESC
      return bDate.getTime() - aDate.getTime();
    });
  };

  const filledResources = useMemo<FilledResources>(() => {
    const finalArray: FilledResources = [];

    if (meetings) {
      const filledRecordings =
        recordings?.reduce<(Recording & ResourceInfo)[]>(
          (accumulator, recording) => {
            const meeting = meetings.find(
              (meeting) => meeting.url === recording.meeting,
            );

            if (meeting) {
              return [
                ...accumulator,
                {
                  ...recording,
                  resource: "recording",
                  meetingObject: meeting,
                },
              ];
            }

            return accumulator;
          },
          [],
        ) || [];

      const filledNotes =
        notes?.reduce<(Notes & ResourceInfo)[]>((accumulator, note) => {
          const meeting = meetings.find(
            (meeting) => meeting.url === note.meeting,
          );

          if (meeting) {
            return [
              ...accumulator,
              {
                ...note,
                resource: "notes",
                meetingObject: meeting,
              },
            ];
          }

          return accumulator;
        }, []) || [];

      finalArray.push(...filledRecordings);
      finalArray.push(...filledNotes);
    }

    return finalArray;
  }, [recordings, meetings, teams, participants]);

  return {
    filledResources: filterAndSortResources(
      filledResources,
      teamFilter,
      resourcesFilter,
    ),
    isRecordingsPending,
    isRecordingsError,
    isNotesPending,
    isNotesError,
    isMeetingsPending,
    isMeetingsError,
    isTeamsPending,
    isTeamsError,
    isTeamPending,
    isTeamError,
    isParticipantsPending,
    isParticipantsError,
  };
};

export default useGetFilledResources;
