type Props = {
  issues?: any[];
};

export default function TopVendorIssues({ issues }: Props) {

  if (!issues || issues.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Top Vendor Issues
        </h2>
        <p className="text-gray-500 text-sm">
          No issue data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-lg font-semibold mb-4">
        Top Vendor Issues
      </h2>

      <div className="overflow-x-auto">

        <table className="min-w-[900px] w-full text-sm">

          <thead className="text-gray-500 border-b">
            <tr className="text-left">
              <th className="py-2">Issue ID</th>
              <th>Vendor</th>
              <th>Issue Description</th>
              <th>Risk Level</th>
              <th>Status</th>
              <th>Days Open</th>
              <th>Owner</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue: any, index: number) => (
              <tr key={index} className="border-b hover:bg-gray-50">

                <td className="py-3 font-medium">{issue.id || "-"}</td>
                <td>{issue.vendor || "-"}</td>
                <td>{issue.desc || "-"}</td>

                <td>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                    {issue.risk || "-"}
                  </span>
                </td>

                <td>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                    {issue.status || "-"}
                  </span>
                </td>

                <td>{issue.days || "-"}</td>
                <td>{issue.owner || "-"}</td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}