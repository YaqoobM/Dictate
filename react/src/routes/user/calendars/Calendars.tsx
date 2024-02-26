import { FC, useState } from "react";
import { GroupBase, OptionsOrGroups } from "react-select";
import { InputGroup, Select } from "../../../components/forms";
import { Sidebar as SidebarLayout } from "../../../components/layouts";
import { useGetMeetings } from "../../../hooks/meetings";
import { useGetTeams } from "../../../hooks/teams";

type SelectOption = {
  label: string;
  value: string;
};

const Calendars: FC = () => {
  const [teamFilter, setTeamFilter] = useState<SelectOption>({
    label: "All Meetings",
    value: "all",
  });

  const {
    meetings,
    isPending: isMeetingsPending,
    isSuccess: isMeetingsSuccess,
    isError: isMeetingsError,
  } = useGetMeetings(teamFilter.value);

  const {
    teams,
    isPending: isTeamsPending,
    isSuccess: isTeamsSuccess,
    isError: isTeamsError,
  } = useGetTeams();

  const options: OptionsOrGroups<SelectOption, GroupBase<SelectOption>> = [
    { label: "General", options: [{ label: "All Meetings", value: "all" }] },
    {
      label: "Teams",
      options: isTeamsPending
        ? [{ label: "Loading...", value: "disabled_option" }]
        : isTeamsError || !teams
          ? [{ label: "Something went wrong...", value: "disabled_option" }]
          : teams.length === 0
            ? [{ label: "No teams available...", value: "disabled_option" }]
            : teams.map((team) => ({ label: team.name, value: team.id })),
    },
  ];

  return (
    <SidebarLayout sidebar="meetings">
      <div className="w-full px-6 py-1.5">
        <Select
          value={teamFilter}
          options={options}
          setValue={setTeamFilter}
          className="inline-block w-auto"
          isOptionDisabled={(option) =>
            (option as SelectOption).value === "disabled_option"
          }
        />
      </div>
      {/* teamFilter for schedule meeting button */}
      {/* <Calendar meetings={meetings} teamFilter={teamFilter} /> */}
    </SidebarLayout>
  );
};

export default Calendars;
