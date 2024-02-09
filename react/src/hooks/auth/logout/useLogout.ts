import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useAxios } from "../../utils";

const useLogout = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const csrftoken = Cookies.get("csrftoken");

  const mutate = useMutation({
    mutationFn: () =>
      axios.post("/api/logout/", {}, { headers: { "X-CSRFToken": csrftoken } }),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  return {
    logout: mutate.mutate,
    reset: mutate.reset,
    isPending: mutate.isPending,
    isSuccess: mutate.isSuccess,
    isError: mutate.isError,
    error: mutate.error,
  };
};

export default useLogout;
