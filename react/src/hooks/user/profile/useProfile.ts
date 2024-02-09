import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { User } from "../../../types";
import { useAxios } from "../../utils";

type Response = {
  user: User;
};

const useProfile = () => {
  const axios = useAxios();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: () => axios.get<Response>("/api/profile/").then((res) => res.data),
    retry: (count, err) => {
      if (err instanceof AxiosError && err.response?.status === 401) {
        return false;
      }
      if (count >= 3) return false;
      return true;
    },
    //         1 min
    staleTime: 1 * 60 * 1000,
    retryOnMount: false,
  });

  return {
    user: query.data?.user,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,
  };
};

export default useProfile;
