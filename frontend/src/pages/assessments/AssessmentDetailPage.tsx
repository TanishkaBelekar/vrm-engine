import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  getAssessmentById,
  submitAssessment,
  reviewAssessment,
  approveAssessment,
  closeAssessment,
  reopenAssessment,
} from "../../entities/assessment/api";

const AssessmentDetailPage = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["assessment", id],
    queryFn: () => getAssessmentById(id!),
    enabled: !!id,
  });

  //  FIX: normalize status
  const status =
    data?.status === "under_review" ? "reviewed" : data?.status;

  //  ACTION HANDLER
  const handleAction = async (action: Function) => {
    try {
      const res = await action(data.id);
      setMessage(res?.data?.message || "Action successful");
      refetch();
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setMessage("Action blocked (role restriction)");
      } else if (err?.response?.status === 409) {
        setMessage(err?.response?.data?.detail || "Invalid transition");
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading assessment</div>;
  if (!data) return <div>No data</div>;

  const steps = ["assigned", "submitted", "reviewed", "approved", "closed"];

  // OPTIONAL DISPLAY LABEL
  const statusLabel =
    data.status === "under_review" ? "Under Review" : data.status;

  return (
    <div>
      <h2>Assessment Detail</h2>

      {/* MESSAGE */}
      {message && <div style={{ marginBottom: 10 }}>{message}</div>}

      {/* DETAILS */}
      <p><strong>ID:</strong> {data.id}</p>
      <p><strong>Status:</strong> {statusLabel}</p>
      <p><strong>Score:</strong> {data.score ?? "N/A"}</p>
      <p><strong>Risk:</strong> {data.risk_level ?? "N/A"}</p>

      {/* TIMELINE */}
      <div style={{ margin: "10px 0" }}>
        {steps.map((step) => (
          <span
            key={step}
            style={{
              marginRight: 8,
              padding: "5px 10px",
              borderRadius: 5,
              background: step === status ? "green" : "lightgray",
              color: step === status ? "white" : "black",
            }}
          >
            {step}
          </span>
        ))}
      </div>

      {/* BUTTONS */}
      <div>
        {status === "assigned" && (
          <button onClick={() => handleAction(submitAssessment)}>
            Submit
          </button>
        )}

        {status === "submitted" && (
          <button onClick={() => handleAction(reviewAssessment)}>
            Review
          </button>
        )}

        {status === "reviewed" && (
          <button onClick={() => handleAction(approveAssessment)}>
            Approve
          </button>
        )}

        {status === "approved" && (
          <button onClick={() => handleAction(closeAssessment)}>
            Close
          </button>
        )}

        {status === "closed" && (
          <button onClick={() => handleAction(reopenAssessment)}>
            Reopen
          </button>
        )}
      </div>
    </div>
  );
};

export default AssessmentDetailPage;