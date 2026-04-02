import { useQuery } from "@tanstack/react-query";

//  No API yet → keep it ready
const fetchVendorOverview = async () => {
  // return await client.get(`/vendors/${id}/overview`);
  return null;
};

const VendorOverview = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor-overview"],
    queryFn: fetchVendorOverview,
  });

  //  Loading
  if (isLoading) {
    return <div className="p-6">Loading overview...</div>;
  }

  //  Error
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load overview
      </div>
    );
  }

  //  Empty (IMPORTANT)
  if (!data) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">
          Overview
        </h2>
        <p className="text-gray-500">
          Overview data will be available once backend APIs are integrated
        </p>
      </div>
    );
  }

  //  Future UI (when API comes)
  return <div>Overview Loaded</div>;
};

export default VendorOverview;