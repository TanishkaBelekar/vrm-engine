import React from "react";
import type { Evidence } from "../../entities/evidence/api";

interface Props {
  evidence: Evidence;
}

const EvidenceRow: React.FC<Props> = ({ evidence }) => {
  const status = evidence.status || "Valid";

  let badgeColor = "green";
  if (status === "Expired") badgeColor = "red";
  else if (status === "Expiring Soon") badgeColor = "orange";

  return (
    <tr>
      <td>{evidence.name}</td>
      <td>{evidence.vendor?.name || evidence.vendor || "N/A"}</td>
      <td>{evidence.type || "N/A"}</td>
      <td>
        {evidence.uploaded_date
          ? new Date(evidence.uploaded_date).toLocaleDateString()
          : "N/A"}
      </td>
      <td>
        {evidence.expiry_date
          ? new Date(evidence.expiry_date).toLocaleDateString()
          : "N/A"}
      </td>
      <td style={{ color: badgeColor }}>{status}</td>
    </tr>
  );
};

export default EvidenceRow;