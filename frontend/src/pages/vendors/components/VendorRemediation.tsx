import { useQuery } from "@tanstack/react-query";

const fetchVendorRemediation = async () => {
  //  Replace with real API later
  // return await client.get(`/vendors/${id}/remediation`);
  return [];
};

const VendorRemediation = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor-remediation"],
    queryFn: fetchVendorRemediation,
  });

  // Loading
  if (isLoading) {
    return <div className="p-6">Loading remediation tasks...</div>;
  }

  //  Error
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load remediation data
      </div>
    );
  }

  //  Empty
  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">
          Remediation
        </h2>
        <p className="text-gray-500">
          No remediation tasks available
        </p>
      </div>
    );
  }

  const statusColor = (status: string) => {
    if (status === "Open") return "bg-gray-100 text-gray-600";
    if (status === "In Progress") return "bg-blue-100 text-blue-600";
    if (status === "Completed") return "bg-green-100 text-green-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">

      <div className="bg-white border rounded-lg p-6">

        <h2 className="font-semibold mb-4">
          Remediation Tasks
        </h2>

        <table className="w-full text-sm">

          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="py-2">Task</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Due Date</th>
            </tr>
          </thead>

          <tbody>

            {data.map((item: any) => (

              <tr key={item.id} className="border-b">

                <td className="py-3">
                  {item.task || "--"}
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

export default VendorRemediation;