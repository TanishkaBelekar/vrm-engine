import client from "../../shared/api/client";

// Types
export type Assessment = {
  id: number;
  status: string;
  score?: number;
  risk_level?: string;
};

// GET ALL
export const getAssessments = async (): Promise<any[]> => {
  try {
    const response = await client.get("/assessments/assessments/");

    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.results)) return response.data.results;

    return [];
  } catch (err: any) {
    console.log("ERROR ", err.response || err);
    throw err;
  }
};

// GET ONE
export const getAssessmentById = async (id: string) => {
  const res = await client.get(`/assessments/assessments/${id}/`);
  return res.data;
};

//  FIXED: WORKFLOW APIs
export const submitAssessment = (id: number) =>
  client.post(`/assessments/assessments/${id}/submit/`, {});

export const reviewAssessment = (id: number) =>
  client.post(`/assessments/assessments/${id}/review/`, {});

export const approveAssessment = (id: number) =>
  client.post(`/assessments/assessments/${id}/approve/`, {});

export const closeAssessment = (id: number) =>
  client.post(`/assessments/assessments/${id}/close/`, {});

export const reopenAssessment = (id: number) =>
  client.post(`/assessments/assessments/${id}/reopen/`, {});