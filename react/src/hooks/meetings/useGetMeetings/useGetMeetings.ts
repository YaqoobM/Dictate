import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Meeting } from "../../../types";
import { useAxios } from "../../utils";

const useGetMeetings = () => {
  const axios = useAxios();

  const query = useQuery({
    queryKey: ["meetings"],
    queryFn: () =>
      axios.get<Meeting[]>("/api/meetings/").then((res) => res.data),
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
