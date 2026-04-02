export type Vendor = {
  id: number;
  name: string;
  risk?: string;       // new optional fields
  posture?: string;    // new optional fields
  sla?: string;        // new optional fields
  status?: string;  
  category?: string;
  riskScore?: number; 
  owner?: string;  // optional field for status
};
export type VendorIssue = {
  id: string
  issue: string
  severity: "Critical" | "High" | "Medium" | "Low"
  status: "Open" | "In Progress" | "Resolved"
  owner: string
  dueDate: string
}

export type VendorRemediation = {
  id: string
  task: string
  progress: number
  deadline: string
  status: string
}