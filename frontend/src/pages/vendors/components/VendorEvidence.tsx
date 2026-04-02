import { useQuery } from "@tanstack/react-query";

const fetchVendorEvidence = async () => {
  //  Replace with real API later
  // return await client.get(`/vendors/${id}/evidence`);
  return [];
};

const VendorEvidence = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor-evidence"],
    queryFn: fetchVendorEvidence,
  });

  //  Loading
  if (isLoading) {
    return <div className="p-6">Loading evidence...</div>;
  }

  // Error
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load evidence
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">
          Evidence
        </h2>
        <p className="text-gray-500">
          No evidence available for this vendor
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === "Approved") return "bg-green-100 text-green-600";
    if (status === "Pending Review") return "bg-yellow-100 text-yellow-600";
    if (status === "Under Review") return "bg-blue-100 text-blue-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">

      {/* Upload UI (kept) */}
      <div className="border rounded-lg p-10 text-center bg-white">
        <h2 className="font-semibold mb-2">
          Upload Evidence Documents
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload will be enabled once API integration is complete
        </p>
      </div>

      {/* Evidence List */}
      <div className="bg-white border rounded-lg p-6">

        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">
            Evidence Documents
          </h2>

          <span className="text-sm text-gray-500">
            {data.length} Documents
          </span>
        </div>

        <div className="space-y-3">

          {data.map((doc: any) => (

            <div
              key={doc.id}
              className="flex justify-between items-center border rounded-lg p-4"
            >

              <div>
                <p className="font-medium">
                  {doc.name || "Unnamed"}
                </p>

                <p className="text-sm text-gray-500">
                  {doc.file_type || "--"} • Uploaded on{" "}
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded ${getStatusColor(doc.status)}`}
              >
                {doc.status || "Unknown"}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default VendorEvidence;