import { useQuery } from "@tanstack/react-query";

const fetchVendorActivity = async () => {
  // Replace with real API later
  // return await client.get(`/vendors/${id}/activity`);
  return [];
};

const VendorActivity = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor-activity"],
    queryFn: fetchVendorActivity,
  });

  //  Loading
  if (isLoading) {
    return <div className="p-6">Loading activity...</div>;
  }

  //  Error
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load activity
      </div>
    );
  }

  // Empty
  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">
          Activity
        </h2>
        <p className="text-gray-500">
          No activity available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="bg-white border rounded-lg p-6">

        <h2 className="font-semibold mb-4">
          Activity Timeline
        </h2>

        <div className="space-y-4">

          {data.map((item: any) => (

            <div
              key={item.id}
              className="border rounded-lg p-4"
            >

              <p className="font-medium">
                {item.title || "Activity"}
              </p>

              <p className="text-sm text-gray-500">
                {item.description || "--"}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {item.actor || "System"} •{" "}
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "--"}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default VendorActivity;