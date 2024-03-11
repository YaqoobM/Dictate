import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useGetProfile } from "..";
import { Meeting } from "../../../types";
import { useAxios } from "../../utils";

const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const { user } = useGetProfile();

  const csrfToken = Cookies.get("csrftoken");

  const mutation = useMutation({
    mutationFn: () => {
      if (!user) {
        throw new Error("Profile not loaded");
      }

      return axios.delete<Meeting>(`/api/users/${user.id}/`, {
        headers: { "X-CSRFToken": csrfToken },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
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
    fn: mutation.mutate,
    reset: mutation.reset,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error,
  };
};

export default useDeleteProfile;
