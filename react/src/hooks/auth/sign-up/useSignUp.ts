import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useAxios } from "../../utils";

type signUpParams = {
  email: string;
  username: string;
  password: string;
};

const useSignUp = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const csrftoken = Cookies.get("csrftoken");

  const mutate = useMutation({
    mutationFn: ({ email, username, password }: signUpParams) =>
      axios.post(
        "/api/signup/",
        { email, username, password },
        { headers: { "X-CSRFToken": csrftoken } },
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  let error = null;

  if (mutate.error && mutate.error instanceof AxiosError) {
    error = mutate.error.response;
  }

  return {
    signUp: mutate.mutate,
    reset: mutate.reset,
    isPending: mutate.isPending,
    isSuccess: mutate.isSuccess,
    isError: mutate.isError,
    error: error,
  };
};

export default useSignUp;
