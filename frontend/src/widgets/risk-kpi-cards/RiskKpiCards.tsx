import KpiCard from "./KpiCard";

type Props = {
  data: {
    total_assessments: number;
    total_reviews: number;
    total_remediations: number;
  };
};

export default function RiskKpiCards({ data }: Props) {
  return (
    <div className="grid grid-cols-3 gap-6">

      <KpiCard
        title="Total Assessments"
        value={data.total_assessments || 0}
        change="Latest count"
      />

      <KpiCard
        title="Total Reviews"
        value={data.total_reviews || 0}
        change="Latest count"
      />

      <KpiCard
        title="Total Remediations"
        value={data.total_remediations || 0}
        change="Latest count"
      />

    </div>
  );
}