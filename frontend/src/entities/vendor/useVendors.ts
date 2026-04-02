import { useQuery } from "@tanstack/react-query"
import { getVendors } from "./api"

export const useVendors = () => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
  })
}