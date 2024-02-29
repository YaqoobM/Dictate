import { FC, useMemo, useState } from "react";
import { Error as ErrorIcon } from "../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../assets/icons/utils";
import { Select } from "../../../components/forms";
import { Sidebar as SidebarLayout } from "../../../components/layouts";
import { useModal } from "../../../hooks/components";
import { useGetMeetings } from "../../../hooks/meetings";
import { useGetTeams } from "../../../hooks/teams";
import { Meeting } from "../../../types";
import { Calendar, Controls, Schedule } from "./components";
import {
  CreateMeetingModal,
  JoinMeetingModal,
  ScheduleMeetingModal,
} from "./modals";

type SelectOption = {
  label: string;
  value: string;
};

type SortedMeetings = {
  month: number;
  year: number;
  meetings: Meeting[];
};

const Calendars: FC = () => {
  const defaultOption: SelectOption = { label: "All Meetings", value: "all" };

  const [activeMonth, setActiveMonth] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [teamFilter, setTeamFilter] = useState<SelectOption>(defaultOption);

  const {
    hidden: hideScheduleMeetingModal,
    setHidden: setHideScheduleMeetingModal,
  } = useModal();

  const { hidden: hideJoinMeetingModal, setHidden: setHideJoinMeetingModal } =
    useModal();

  const {
    hidden: hideCreateMeetingModal,
    setHidden: setHideCreateMeetingModal,
  } = useModal();

  const {
    meetings,
    isPending: isMeetingsPending,
    isError: isMeetingsError,
  } = useGetMeetings(teamFilter.value);

  const {
    teams,
    isPending: isTeamsPending,
    isError: isTeamsError,
  } = useGetTeams();

  // sort and filter meetings
  const cleanedMeetings: SortedMeetings[] = useMemo(() => {
    const array: SortedMeetings[] = [];

    for (const meeting of meetings || []) {
      let month = parseInt(meeting.start_time.split(" ")[0].split("/")[1]) - 1;
      let year = parseInt(
        `20${meeting.start_time.split(" ")[0].split("/")[2]}`,
      );

      let sortedMeeting = array.find(
        (v) => v.month === month && v.year === year,
      );

      if (
        teamFilter.value === "all" ||
        teamFilter.value === meeting.team?.split("/").slice(-2, -1)[0]
      ) {
        if (sortedMeeting) {
          sortedMeeting.meetings.push(meeting);
        } else {
          array.push({ month, year, meetings: [meeting] });
        }
      }
    }

    return array;
  }, [meetings]);

  const options: SelectOption[] = useMemo(() => {
    const array = [defaultOption];

    if (isTeamsPending) {
      array.push({ label: "Loading...", value: "disabled_option" });
    } else if (isTeamsError || !teams) {
      array.push({
        label: "Something went wrong...",
        value: "disabled_option",
      });
    } else if (teams.length === 0) {
      array.push({
        label: "No teams available...",
        value: "disabled_option",
      });
    } else {
      array.push(
        ...teams.map((team) => ({ label: team.name, value: team.id })),
      );
    }

    return array;
  }, [teams, isTeamsPending]);

  return (
    <SidebarLayout
      sidebar="meetings"
      setHideJoinMeetingModal={setHideJoinMeetingModal}
      setHideCreateMeetingModal={setHideCreateMeetingModal}
    >
      <div className="px-6 py-1.5">
        <div className="flex items-center gap-x-4">
          <Select
            value={teamFilter}
            setValue={setTeamFilter}
            options={options}
            inputBox={false}
            dropdownClass="min-w-max w-screen max-w-32"
          />
          {isMeetingsPending ? (
            <LoadingIcon
              className="animate-spin stroke-amber-500 dark:stroke-amber-300"
              height="26"
            />
          ) : isMeetingsError ? (
            <h2 className="flex items-center gap-x-2">
              <ErrorIcon className="stroke-red-600" height="26" />
              <span className="tracking-tight text-red-600">
                Something went wrong finding your meetings
              </span>
            </h2>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-y-10 px-6 xl:flex-row xl:items-start xl:justify-between">
        <Calendar
          className="mb-8 grow-[4] xl:mb-0 xl:mr-6"
          date={activeMonth}
          meetings={cleanedMeetings}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        <aside className="order-first flex grow flex-col gap-y-3 xl:order-none xl:w-[330px]">
          <Controls
            date={activeMonth}
            setDate={setActiveMonth}
            setHideScheduleMeetingModal={setHideScheduleMeetingModal}
          />
          <Schedule
            meetings={cleanedMeetings
              .filter(
                (monthlyMeetings) =>
                  selectedDay &&
                  monthlyMeetings.month === selectedDay.getMonth() &&
                  monthlyMeetings.year === selectedDay.getFullYear(),
              )
              .reduce<Meeting[]>((accumulator, value) => {
                let temp_meetings: Meeting[] = [];

                value.meetings.forEach((meeting) => {
                  if (
                    parseInt(meeting.start_time.split(" ")[0].split("/")[0]) ===
                    selectedDay?.getDate()
                  ) {
                    temp_meetings.push(meeting);
                  }
                });

                return [...accumulator, ...temp_meetings];
              }, [])}
            day={selectedDay}
          />
        </aside>
      </div>

      <ScheduleMeetingModal
        hidden={hideScheduleMeetingModal}
        setHidden={setHideScheduleMeetingModal}
      />
      <JoinMeetingModal
        hidden={hideJoinMeetingModal}
        setHidden={setHideJoinMeetingModal}
      />
      <CreateMeetingModal
        hidden={hideCreateMeetingModal}
        setHidden={setHideCreateMeetingModal}
      />
    </SidebarLayout>
  );
};

export default Calendars;
