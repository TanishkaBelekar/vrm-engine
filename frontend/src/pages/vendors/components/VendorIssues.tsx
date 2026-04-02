import { useQuery } from "@tanstack/react-query";

const fetchVendorIssues = async () => {
  //  Replace with real API later
  // return await client.get(`/vendors/${id}/issues`);
  return [];
};

const VendorIssues = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor-issues"],
    queryFn: fetchVendorIssues,
  });

  //  Loading
  if (isLoading) {
    return <div className="p-6">Loading issues...</div>;
  }

  // Error
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load issues
      </div>
    );
  }

  //  Empty
  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">
          Issues
        </h2>
        <p className="text-gray-500">
          No issues reported for this vendor
        </p>
      </div>
    );
  }

  const severityColor = (severity: string) => {
    if (severity === "Critical") return "bg-red-100 text-red-600";
    if (severity === "High") return "bg-orange-100 text-orange-600";
    if (severity === "Medium") return "bg-yellow-100 text-yellow-600";
    return "bg-blue-100 text-blue-600";
  };

  const statusColor = (status: string) => {
    if (status === "Open") return "bg-gray-100 text-gray-600";
    if (status === "In Progress") return "bg-blue-100 text-blue-600";
    if (status === "Under Review") return "bg-purple-100 text-purple-600";
    if (status === "Resolved") return "bg-green-100 text-green-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">

      <div className="border rounded-lg bg-white p-6">

        <h2 className="font-semibold mb-4">
          Risk Issues
        </h2>

        <table className="w-full text-sm">

          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="py-2">Issue</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Due Date</th>
            </tr>
          </thead>

          <tbody>

            {data.map((item: any) => (

              <tr key={item.id} className="border-b">

                <td className="py-3">
                  {item.issue || "--"}
                </td>

                <td>
                  <span className={`px-3 py-1 text-xs rounded ${severityColor(item.severity)}`}>
                    {item.severity || "--"}
                  </span>
                </td>

                <td>
                  <span className={`px-3 py-1 text-xs rounded ${statusColor(item.status)}`}>
                    {item.status || "--"}
                  </span>
                </td>

                <td>
                  {item.owner || "--"}
                </td>

                <td>
                  {item.due || "--"}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default VendorIssues;