import { useQuery } from "@tanstack/react-query";
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
  });

  // todo: stale time

  return {
    user: query.data?.user,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,
  };
};

export default useProfile;
