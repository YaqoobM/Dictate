import { FC, useMemo, useState } from "react";
import { ResourcesGrid } from ".";
import { Error as ErrorIcon } from "../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../assets/icons/utils";
import { Select, SelectOption } from "../../../components/forms";
import { useGetTeams } from "../../../hooks/teams";
import { Meeting, Notes, Recording } from "../../../types";
import { useGetFilledResources } from "./hooks";

export type ResourceInfo = {
  resource: "recording" | "notes";
  meetingObject: Meeting;
};

export type FilledResources = (
  | (Notes & ResourceInfo)
  | (Recording & ResourceInfo)
)[];

const Resources: FC = () => {
  const defaultFilterOption: SelectOption = {
    label: "All Resources",
    value: "all",
  };

  const defaultTeamOption: SelectOption = {
    label: "All Meetings",
    value: "all",
  };

  const [teamFilter, setTeamFilter] = useState<SelectOption>(defaultTeamOption);
  const [resourcesFilter, setResourcesFilter] =
    useState<SelectOption>(defaultFilterOption);

  const {
    teams,
    isPending: isTeamsPending,
    isError: isTeamsError,
  } = useGetTeams();

  const {
    filledResources,
    isRecordingsPending,
    isRecordingsError,
    isNotesPending,
    isNotesError,
    isMeetingsError,
    isTeamError,
  } = useGetFilledResources(teamFilter, resourcesFilter);

  const teamOptions: SelectOption[] = useMemo(() => {
    const array = [defaultTeamOption];

    if (isTeamsPending) {
      array.push({ label: "Loading...", value: "loading", disabled: true });
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

  const filterOptions: SelectOption[] = [
    defaultFilterOption,
    { label: "Recordings", value: "recording" },
    { label: "Notes", value: "notes" },
  ];

  return (
    <div className="px-6 py-1.5">
      <div className="mb-1.5 flex items-center gap-x-4">
        <Select
          value={resourcesFilter}
          setValue={setResourcesFilter}
          options={filterOptions}
          inputBox={false}
          dropdownClass="min-w-max w-screen max-w-32"
        />
        <Select
          value={teamFilter}
          setValue={setTeamFilter}
          options={teamOptions}
          inputBox={false}
          dropdownClass="min-w-max w-screen max-w-32"
        />
        {isRecordingsPending || isNotesPending ? (
          <LoadingIcon
            className="animate-spin stroke-amber-500 dark:stroke-amber-300"
            height="26"
          />
        ) : isRecordingsError ||
          isNotesError ||
          isMeetingsError ||
          isTeamError ? (
          <h2 className="flex items-center gap-x-2">
            <ErrorIcon className="stroke-red-600" height="26" />
            <span className="tracking-tight text-red-600">
              Something went wrong finding your resources
            </span>
          </h2>
        ) : (
          ""
        )}
      </div>
      <section>
        <ResourcesGrid resources={filledResources} />
      </section>
    </div>
  );
};

export default Resources;
