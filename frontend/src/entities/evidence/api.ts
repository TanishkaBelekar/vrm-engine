import client from "../../shared/api/client";

export interface Evidence {
  id: number;
  name: string;
  vendor?: any;
  type?: string;
  uploaded_date?: string;
  expiry_date?: string;
  status?: "Valid" | "Expiring Soon" | "Expired";
  created_at: string;
}

// GET Evidence
export const getEvidence = async (): Promise<Evidence[]> => {
  try {
    const res = await client.get("/evidence/");

    console.log("Evidence API response:", res.data);

    // Handles both paginated & non-paginated responses
    if (Array.isArray(res.data)) return res.data;
    if (res.data?.results) return res.data.results;

    return [];
  } catch (err: any) {
    console.error(
      "Failed to fetch evidence:",
      err.response?.status,
      err.response?.data
    );
    throw err; // let react-query handle error state
  }
};

// POST Upload Evidence
export const uploadEvidence = async (formData: FormData) => {
  try {
    const res = await client.post("/evidence/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err: any) {
    console.error("Upload failed:", err.response?.data || err.message);
    throw err;
  }
};