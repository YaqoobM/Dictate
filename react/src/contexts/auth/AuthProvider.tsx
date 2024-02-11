import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { FC, ReactNode, useEffect, useState } from "react";
import { AuthContext } from ".";
import { useAxios } from "../../hooks/utils";

type LoginParams = {
  email: string;
  password: string;
};

type SignUpParams = {
  email: string;
  username: string;
  password: string;
};

type ErrorType = {
  value: AxiosResponse | null;
  state: Error | null;
};

type Props = {
  children: ReactNode;
};

const AuthProvider: FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const axios = useAxios();

  const csrfToken = Cookies.get("csrftoken");

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginParams) =>
      axios.post(
        "/api/login/",
        { email, password },
        { headers: { "X-CSRFToken": csrfToken } },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () =>
      axios.post("/api/logout/", {}, { headers: { "X-CSRFToken": csrfToken } }),
    onSuccess: () => {
      queryClient.invalidateQueries();

      if (isAuthenticated) {
        setIsAuthenticated(false);
      }
    },
  });

  const signUpMutation = useMutation({
    mutationFn: ({ email, username, password }: SignUpParams) =>
      axios.post(
        "/api/signup/",
        { email, username, password },
        { headers: { "X-CSRFToken": csrfToken } },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
    },
  });

  const errors: Record<string, ErrorType> = {
    loginError: { value: null, state: loginMutation.error },
    logoutError: { value: null, state: logoutMutation.error },
    signUpError: { value: null, state: signUpMutation.error },
  };

  for (let [key, { state }] of Object.entries(errors)) {
    if (state && state instanceof AxiosError && state.response) {
      errors[key].value = state.response;
    }
  }

  const login = (
    email: string,
    password: string,
    options: { onSuccess?: () => void; onError?: () => void },
  ) => {
    loginMutation.mutate({ email, password }, options);
  };

  const logout = (options: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    logoutMutation.mutate(undefined, options);
  };

  const signUp = (
    email: string,
    username: string,
    password: string,
    options: { onSuccess?: () => void; onError?: () => void },
  ) => {
    signUpMutation.mutate({ email, username, password }, options);
  };

  useEffect(() => {
    axios
      .get("/api/profile/")
      .then((res) => {
        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        loginReset: loginMutation.reset,
        loginIsPending: loginMutation.isPending,
        loginIsSuccess: loginMutation.isSuccess,
        loginIsError: loginMutation.isError,
        loginError: errors.loginError.value,
        logout,
        logoutReset: logoutMutation.reset,
        logoutIsPending: logoutMutation.isPending,
        logoutIsSuccess: logoutMutation.isSuccess,
        logoutIsError: logoutMutation.isError,
        logoutError: errors.logoutError.value,
        signUp,
        signUpReset: signUpMutation.reset,
        signUpIsPending: signUpMutation.isPending,
        signUpIsSuccess: signUpMutation.isSuccess,
        signUpIsError: signUpMutation.isError,
        signUpError: errors.signUpError.value,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
