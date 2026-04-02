import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getVendorById } from "../../entities/vendor/api";

import VendorOverview from "./components/VendorOverview";
import VendorAssessments from "./components/VendorAssessments";
import VendorEvidence from "./components/VendorEvidence";
import VendorIssues from "./components/VendorIssues";
import VendorRemediation from "./components/VendorRemediation";
import VendorActivity from "./components/VendorActivity";

const VendorProfile = () => {

  const { vendorId } = useParams();

  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: () => getVendorById(vendorId!)
  });

  if (isLoading) return <div>Loading vendor...</div>;
  if (error) return <div>Failed to load vendor</div>;

  return (
    <div>

      <h1 className="text-2xl font-semibold mb-6">
        {data?.name}
      </h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">

        <button onClick={() => setActiveTab("overview")}>Overview</button>

        <button onClick={() => setActiveTab("assessments")}>Assessments</button>

        <button onClick={() => setActiveTab("evidence")}>Evidence</button>

        <button onClick={() => setActiveTab("issues")}>Issues</button>

        <button onClick={() => setActiveTab("remediation")}>Remediation</button>

        <button onClick={() => setActiveTab("activity")}>Activity</button>

      </div>

      {/* Tab Content */}

      {activeTab === "overview" && <VendorOverview />}

      {activeTab === "assessments" && <VendorAssessments />}

      {activeTab === "evidence" && <VendorEvidence />}

      {activeTab === "issues" && <VendorIssues />}

      {activeTab === "remediation" && <VendorRemediation />}

      {activeTab === "activity" && <VendorActivity />}

    </div>
  );
};

export default VendorProfile;