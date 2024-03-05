import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { Notes } from "../../../types";
import { useAxios } from "../../utils";

type MutationParams = {
  id: string;
  newName: string;
};

const useRenameNotes = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const csrfToken = Cookies.get("csrftoken");

  const mutation = useMutation({
    mutationFn: ({ id, newName }: MutationParams) =>
      axios.patch<Notes>(
        `/api/notes/${id}/`,
        { title: newName },
        { headers: { "X-CSRFToken": csrfToken } },
      ),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          if (query.queryKey[0] === "notes" && query.queryKey[1] === data.id) {
            return true;
          }

          if (query.queryKey[0] === "notes") {
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
    patch: mutation.mutate,
    reset: mutation.reset,
    notes: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error,
  };
};

export default useRenameNotes;
