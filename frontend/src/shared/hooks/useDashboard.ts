import { useQuery } from "@tanstack/react-query";
import client from "../api/client";

export type DashboardData = {
  total_assessments: number;
  total_reviews: number;
  total_remediations: number;
};

const getDashboard = async (): Promise<DashboardData> => {
  const res = await client.get("/dashboard/stats/");
  return res.data;
};

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
};