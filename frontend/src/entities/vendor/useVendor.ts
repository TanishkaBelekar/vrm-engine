import { useQuery } from "@tanstack/react-query"
import { getVendorById } from "./api"

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: ["vendor", id],
    queryFn: () => getVendorById(id),
    enabled: !!id,
  })
}