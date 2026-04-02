type Props = {
  title: string;
  value: number;
  change: string;
};

export default function KpiCard({ title, value, change }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">

      <p className="text-gray-500">{title}</p>

      <h2 className="text-3xl font-semibold">
        {value}
      </h2>

      <p className="text-sm text-green-600">
        {change}
      </p>

    </div>
  );
}