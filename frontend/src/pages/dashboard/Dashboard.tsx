import { useDashboard } from "../../shared/hooks/useDashboard";

import RiskKpiCards from "../../widgets/risk-kpi-cards/RiskKpiCards";
import RiskTrendChart from "../../widgets/risk-trend-chart/RiskTrendChart";
import VendorPosture from "../../widgets/vendor-posture/VendorPosture";
import TopVendorIssues from "./components/TopVendorIssues";
import RemediationSLA from "./components/RemediationSLA";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  //  Loading
  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  //  Error
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  //  Safety check
  if (!data) {
    return <div className="p-6">No dashboard data available</div>;
  }

  return (
    <div className="p-6 space-y-6">

      {/*  Backend Data */}
      <RiskKpiCards data={data} />

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2">
          <RiskTrendChart />
        </div>

        <VendorPosture />

      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">

        <div className="col-span-2">
          <TopVendorIssues />
        </div>

        <div>
          <RemediationSLA />
        </div>

      </div>

    </div>
  );
}