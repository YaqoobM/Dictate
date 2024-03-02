import { useMemo } from "react";
import { FilledResources, ResourceInfo } from "..";
import { SelectOption } from "../../../../components/forms";
import { useGetMeetings, useGetParticipants } from "../../../../hooks/meetings";
import { useGetNotes, useGetRecordings } from "../../../../hooks/resources";
import { useGetTeam, useGetTeams } from "../../../../hooks/teams";
import { Meeting, Notes, Recording } from "../../../../types";

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

  const fillResource: (
    resource: (Recording & ResourceInfo) | (Notes & ResourceInfo),
    meeting: Meeting,
  ) => void = (resource, meeting) => {
    resource.day = parseInt(meeting.start_time.split(" ")[0].split("/")[0]);
    resource.month =
      parseInt(meeting.start_time.split(" ")[0].split("/")[1]) - 1;
    resource.year = parseInt(
      `20${meeting.start_time.split(" ")[0].split("/")[2]}`,
    );

    resource.startTime = `${
      meeting.start_time.split(" ")[1].split(":")[0]
    }:${meeting.start_time.split(" ")[1].split(":")[1]}`;

    if (meeting.end_time) {
      resource.endTime = `${
        meeting.end_time.split(" ")[1].split(":")[0]
      }:${meeting.end_time.split(" ")[1].split(":")[1]}`;
    }

    if (meeting.team && teams) {
      resource.team = teams.find((team) => team.url === meeting?.team)?.name;
    } else if (
      meeting.participants &&
      participants.every((participant) => participant)
    ) {
      resource.participants = participants
        .filter((participant) =>
          meeting!.participants!.includes(participant!.url),
        )
        .map((participant) => participant!.username);
    }
  };

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
      if (
        !a.startTime ||
        !a.year ||
        !a.month ||
        !a.day ||
        !b.startTime ||
        !b.year ||
        !b.month ||
        !b.day
      ) {
        return 0;
      }

      const aDate = new Date(
        a.year,
        a.month,
        a.day,
        parseInt(a.startTime.split(":")[0]),
        parseInt(a.startTime.split(":")[1]),
      );

      const bDate = new Date(
        b.year,
        b.month,
        b.day,
        parseInt(b.startTime.split(":")[0]),
        parseInt(b.startTime.split(":")[1]),
      );

      // DESC
      return bDate.getTime() - aDate.getTime();
    });
  };

  const filledResources = useMemo<FilledResources>(() => {
    const finalArray: FilledResources = [];

    if (meetings) {
      const filledRecordings: (Recording & ResourceInfo)[] =
        recordings?.map((recording) => {
          const filledRecording: Recording & ResourceInfo = {
            ...recording,
            resource: "recording",
          };

          const meeting = meetings.find(
            (meeting) => meeting.url === recording.meeting,
          );

          if (meeting) {
            fillResource(filledRecording, meeting);
          }

          return filledRecording;
        }) || [];

      const filledNotes: (Notes & ResourceInfo)[] =
        notes?.map((note) => {
          const filledNotes: Notes & ResourceInfo = {
            ...note,
            resource: "notes",
          };

          const meeting = meetings.find(
            (meeting) => meeting.url === note.meeting,
          );

          if (meeting) {
            fillResource(filledNotes, meeting);
          }

          return filledNotes;
        }) || [];

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
