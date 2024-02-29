import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { User } from "../../../types";
import { useAxios } from "../../utils";

const useGetUserFn = (id: string) => {
  const axios = useAxios();
  return axios.get<User>(`/api/users/${id}/`).then((res) => res.data);
};

const useGetUser = (
  id: string,
  retryOnMount: boolean = true,
  enabled: boolean = true,
) => {
  const query = useQuery({
    queryKey: ["user", id],
    queryFn: () => useGetUserFn(id),
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
    user: query.data,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error,
  };
};

export { useGetUserFn };
export default useGetUser;
