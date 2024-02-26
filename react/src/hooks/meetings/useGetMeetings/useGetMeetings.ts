import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Meeting, Team } from "../../../types";
import { useAxios } from "../../utils";

type MeetingResponse = Meeting[];
type TeamResponse = Team;

const useGetMeetings = (team: string = "all") => {
  const axios = useAxios();

  const query = useQuery({
    queryKey: ["meetings", team],
    queryFn: () => {
      if (team.toLowerCase() === "all") {
        return axios
          .get<MeetingResponse>("/api/meetings/")
          .then((res) => res.data);
      }

      return Promise.all([
        axios.get<MeetingResponse>("/api/meetings/").then((res) => res.data),
        axios
          .get<TeamResponse>(`/api/teams/${team}/`)
          .then((res) => res.data.meetings),
      ]).then((res) =>
        res[0].filter((meeting) => res[1].includes(meeting.url)),
      );
    },
    //         1 min
    staleTime: 1 * 60 * 1000,
  });

  let error: AxiosResponse | null = null;

  if (
    query.error &&
    query.error instanceof AxiosError &&
    query.error.response
  ) {
    error = query.error.response;
  }

  return {
    meetings: query.data,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error,
  };
};

export default useGetMeetings;
