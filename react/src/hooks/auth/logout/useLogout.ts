import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useAxios } from "../../utils";

/** For internal use only, use AuthContext instead */
const useLogout = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const csrftoken = Cookies.get("csrftoken");

  const mutate = useMutation({
    mutationFn: () =>
      axios.post("/api/logout/", {}, { headers: { "X-CSRFToken": csrftoken } }),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  let error = null;

  if (
    mutate.error &&
    mutate.error instanceof AxiosError &&
    mutate.error.response
  ) {
    error = mutate.error.response;
  }

  return {
    logout: mutate.mutate,
    reset: mutate.reset,
    isPending: mutate.isPending,
    isSuccess: mutate.isSuccess,
    isError: mutate.isError,
    error,
  };
};

export default useLogout;
