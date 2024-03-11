import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useGetProfile } from "..";
import { User } from "../../../types";
import { useAxios } from "../../utils";

type MutationParams = {
  email?: string;
  username?: string;
  password?: string;
};

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const { user } = useGetProfile();

  const csrfToken = Cookies.get("csrftoken");

  const mutation = useMutation({
    mutationFn: ({ email, username, password }: MutationParams) => {
      if (!user) {
        throw new Error("Profile not loaded");
      }

      return axios.patch<User>(
        `/api/users/${user?.id}/`,
        { email, username, password },
        { headers: { "X-CSRFToken": csrfToken } },
      );
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          if (query.queryKey[0] === "user" && query.queryKey[1] === data.id) {
            return true;
          }

          if (query.queryKey[0] === "profile") {
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
    update: mutation.mutate,
    reset: mutation.reset,
    user: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error,
  };
};

export default useUpdateProfile;
