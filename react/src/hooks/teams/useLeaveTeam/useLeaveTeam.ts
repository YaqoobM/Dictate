import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { Team } from "../../../types";
import { useAxios } from "../../utils";

type MutationParams = {
  id: string;
};

const useLeaveTeam = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const csrfToken = Cookies.get("csrftoken");

  const mutation = useMutation({
    mutationFn: ({ id }: MutationParams) =>
      axios.post<Team>(
        `/api/teams/${id}/leave/`,
        {},
        { headers: { "X-CSRFToken": csrfToken } },
      ),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          if (query.queryKey[0] === "team" && query.queryKey[1] === data.id) {
            return true;
          }

          if (query.queryKey[0] === "teams") {
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
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error,
  };
};

export default useLeaveTeam;
