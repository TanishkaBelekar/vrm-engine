type Props = {
  data?: {
    name: string;
    progress: number;
  }[];
};

const RemediationSLA = ({ data }: Props) => {

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Remediation SLA Status
        </h2>
        <p className="text-gray-500 text-sm">
          No remediation data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4">
        Remediation SLA Status
      </h2>

      {data.map((item, index) => (

        <div key={index} className="mb-4">

          <div className="flex justify-between text-sm">
            <span>{item.name || "-"}</span>
            <span>{item.progress ?? 0}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded h-2 mt-1">

            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${item.progress ?? 0}%` }}
            />

          </div>

        </div>

      ))}

    </div>
  );
};

export default RemediationSLA;