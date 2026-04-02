import React, { useState } from "react";
import { useEvidence } from "../../entities/evidence/useEvidence";
import { uploadEvidence } from "../../entities/evidence/api";
import EvidenceRow from "./Evidence";

const EvidencePage = () => {
  const { data, isLoading, isError, refetch } = useEvidence();

  const [search, setSearch] = useState("");

  //  Upload handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadEvidence(formData);
      alert("Upload successful");
      refetch(); // refresh list
    } catch {
      alert("Upload failed");
    }
  };

  //  Loading
  if (isLoading) return <p>Loading evidence...</p>;

  //  Error
  if (isError) return <p>Failed to load evidence</p>;

  const evidenceList = data || [];

  //  Search filter
  const filtered = evidenceList.filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase())
  );

  //  Stats (Figma requirement)
  const valid = evidenceList.filter((e) => e.status === "Valid").length;
  const expiring = evidenceList.filter(
    (e) => e.status === "Expiring Soon"
  ).length;
  const expired = evidenceList.filter((e) => e.status === "Expired").length;

  return (
    <div>
      <h2>Evidence Center</h2>

      {/*  Upload */}
      <input type="file" onChange={handleUpload} />

      {/*  Search */}
      <input
        placeholder="Search evidence..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ display: "block", margin: "10px 0" }}
      />

      {/*  Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div>Valid: {valid}</div>
        <div>Expiring Soon: {expiring}</div>
        <div>Expired: {expired}</div>
      </div>

      {/*  Empty */}
      {filtered.length === 0 ? (
        <p>No evidence found</p>
      ) : (
        <table border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Vendor</th>
              <th>Type</th>
              <th>Uploaded</th>
              <th>Expiry</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((e) => (
              <EvidenceRow key={e.id} evidence={e} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EvidencePage;