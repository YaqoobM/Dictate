import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { Meeting } from "../../../types";
import { useAxios } from "../../utils";

type MutationParams = {
  team?: string;
  start_time?: string;
  end_time?: string;
};

const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const csrfToken = Cookies.get("csrftoken");

  const mutation = useMutation({
    mutationFn: ({ team, start_time, end_time }: MutationParams) =>
      axios.post<Meeting>(
        "/api/meetings/",
        { team, start_time, end_time },
        { headers: { "X-CSRFToken": csrfToken } },
      ),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          if (
            query.queryKey[0] === "meeting" &&
            query.queryKey[1] === data.id
          ) {
            return true;
          }

          if (query.queryKey[0] === "meetings") {
            return true;
          }

          return false;
        },
      });
    },
  });

  let error: AxiosResponse | null = null;

  if (
    mutation.error &&
    mutation.error instanceof AxiosError &&
    mutation.error.response
  ) {
    error = mutation.error.response;
  }

  return {
    create: mutation.mutate,
    reset: mutation.reset,
    meeting: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error,
  };
};

export default useCreateMeeting;
