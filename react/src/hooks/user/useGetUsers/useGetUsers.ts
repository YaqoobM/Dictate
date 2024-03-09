import { useQueries } from "@tanstack/react-query";
import { useGetUserFn } from "..";

const useGetUsers = (ids: string[]) => {
  const usersQuery = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["user", id],
      queryFn: () => useGetUserFn(id),
      //         1 min
      staleTime: 1 * 60 * 1000,
    })),
  });

  return {
    users: usersQuery.map((query) => query.data),
    isPending: usersQuery.some((query) => query.isPending),
    isSuccess: usersQuery.some((query) => query.isSuccess),
    isError: usersQuery.some((query) => query.isError),
  };
};

export default useGetUsers;
