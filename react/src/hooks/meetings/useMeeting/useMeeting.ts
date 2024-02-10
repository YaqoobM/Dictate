import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Meeting } from "../../../types";
import { useAxios } from "../../utils";

type Response = {
  meeting: Meeting;
};

const useMeeting = (
  id: string,
  retryOnMount: boolean = true,
  enabled: boolean = true,
) => {
  const axios = useAxios();

  const query = useQuery({
    queryKey: ["meeting", id],
    queryFn: () =>
      axios.get<Response>(`/api/meetings/${id}/`).then((res) => res.data),
    retry: false,
    //         1 min
    staleTime: 1 * 60 * 1000,
    retryOnMount,
    enabled,
  });

  let error = null;

  if (query.error && query.error instanceof AxiosError) {
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

export default useMeeting;
