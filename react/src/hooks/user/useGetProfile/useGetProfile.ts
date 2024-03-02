import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { User } from "../../../types";
import { useAxios } from "../../utils";

const useGetProfile = (
  retryOnMount: boolean = true,
  enabled: boolean = true,
) => {
  const axios = useAxios();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      axios
        .get<{
          user: User;
        }>("/api/profile/")
        .then((res) => res.data),
    retry: (count, err) => {
      if (err instanceof AxiosError && err.response?.status === 401) {
        return false;
      }
      if (count >= 3) return false;
      return true;
    },
    //         1 min
    staleTime: 1 * 60 * 1000,
    retryOnMount,
    enabled,
  });

  let error = null;

  if (
    query.error &&
    query.error instanceof AxiosError &&
    query.error.response
  ) {
    error = query.error.response;
  }

  return {
    refetch: query.refetch,
    user: query.data?.user,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error,
  };
};

export default useGetProfile;
