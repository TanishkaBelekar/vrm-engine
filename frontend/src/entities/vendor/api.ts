import client from "../../shared/api/client"
import type { Vendor } from "./types"

export const getVendors = async (): Promise<Vendor[]> => {
  const res = await client.get("/vendors/vendors/")
  return res.data
}

export const getVendorById = async (id: string) => {
  const res = await client.get(`/vendors/vendors/${id}/`);
  return res.data;
};
export const createVendor = async (data: Partial<Vendor>) => {
  const res = await client.post("/vendors/vendors/", data)
  return res.data
}

export const updateVendor = async (id: string, data: Partial<Vendor>) => {
  const res = await client.put(`/vendors/vendors/${id}/`, data)
  return res.data
}