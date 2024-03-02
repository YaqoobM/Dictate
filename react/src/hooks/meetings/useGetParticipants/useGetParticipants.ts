import { useQueries } from "@tanstack/react-query";
import { Meeting } from "../../../types";
import { useGetUserFn } from "../../user";

const useGetParticipants = (meetings: Meeting[]) => {
  const participantQuery = useQueries({
    queries: meetings
      .reduce<string[]>((accumulator, value) => {
        if (!value.team && value.participants) {
          return [
            ...accumulator,
            ...value.participants.filter((p) => !accumulator.includes(p)),
          ];
        }
        return [...accumulator];
      }, [])
      .map((participant) => {
        const id = participant.split("/").slice(-2, -1)[0];

        return {
          queryKey: ["user", id],
          queryFn: () => useGetUserFn(participant.split("/").slice(-2, -1)[0]),
          //         1 min
          staleTime: 1 * 60 * 1000,
        };
      }),
  });

  return {
    participants: participantQuery.map((query) => query.data),
    isPending: participantQuery.some((query) => query.isPending),
    isSuccess: participantQuery.some((query) => query.isSuccess),
    isError: participantQuery.some((query) => query.isError),
  };
};

export default useGetParticipants;
