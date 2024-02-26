import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { Recording } from "../../../types";
import { useAxios } from "../../utils";

type MutationParams = {
  meeting: string;
  file: File;
};

type Response = Recording;

const useSaveRecording = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const csrfToken = Cookies.get("csrftoken");

  const mutation = useMutation({
    mutationFn: ({ meeting, file }: MutationParams) => {
      const data = new FormData();
      data.append("meeting", meeting);
      data.append("recording", file);

      return axios.post<Response>("/api/recordings/", data, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          if (
            query.queryKey[0] === "recording" &&
            query.queryKey[1] === data.id
          ) {
            return true;
          }

          if (query.queryKey[0] === "recordings") {
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
    recording: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error,
  };
};

export default useSaveRecording;
