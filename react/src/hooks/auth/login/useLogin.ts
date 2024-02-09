import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useAxios } from "../../utils";

type loginParams = {
  email: string;
  password: string;
};

const useLogin = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const csrftoken = Cookies.get("csrftoken");

  const mutate = useMutation({
    mutationFn: ({ email, password }: loginParams) =>
      axios.post(
        "/api/login/",
        { email, password },
        { headers: { "X-CSRFToken": csrftoken } },
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  let error = null;

  if (mutate.error && mutate.error instanceof AxiosError) {
    error = mutate.error.response;
  }

  return {
    login: mutate.mutate,
    reset: mutate.reset,
    isPending: mutate.isPending,
    isSuccess: mutate.isSuccess,
    isError: mutate.isError,
    error: error,
  };
};

export default useLogin;
