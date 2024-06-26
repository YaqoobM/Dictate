import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Meeting } from "../../../types";
import { useAxios } from "../../utils";

const useGetMeeting = (
  id: string,
  retryOnMount: boolean = true,
  enabled: boolean = true,
) => {
  const axios = useAxios();

  const query = useQuery({
    queryKey: ["meeting", id],
    queryFn: () =>
      axios.get<Meeting>(`/api/meetings/${id}/`).then((res) => res.data),
    retry: false,
    //         1 min
    staleTime: 1 * 60 * 1000,
    retryOnMount,
    enabled,
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
    refetch: query.refetch,
    meeting: query.data,
    isPending: query.isPending,
    isFetching: query.isFetching,
    isFetched: query.isFetched,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error,
  };
};

export default useGetMeeting;
