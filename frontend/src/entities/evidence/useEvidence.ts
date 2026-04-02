import { useQuery } from "@tanstack/react-query";
import { getEvidence } from "./api";

export const useEvidence = () => {
  return useQuery({
    queryKey: ["evidence"],
    queryFn: getEvidence,
    staleTime: 1000 * 60 * 5, // cache for 5 min
    retry: 1,
  });
};