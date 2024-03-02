import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Team } from "../../../types";
import { useAxios } from "../../utils";

const useGetTeams = () => {
  const axios = useAxios();

  const query = useQuery({
    queryKey: ["teams"],
    queryFn: () => axios.get<Team[]>("/api/teams/").then((res) => res.data),
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
    teams: query.data,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error,
  };
};

export default useGetTeams;
