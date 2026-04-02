import { useQuery } from "@tanstack/react-query";
import { getAssessments } from "./api";

export const useAssessments = () => {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: getAssessments,
  });
};