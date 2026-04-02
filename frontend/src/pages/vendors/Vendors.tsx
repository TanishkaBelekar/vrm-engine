import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getVendors } from "@/entities/vendor/api";
import VendorForm from "./components/VendorForm";

const Vendors = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const { data: vendors, isLoading, refetch } = useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
  });

  const filteredVendors = vendors?.filter((v: any) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div>Loading vendors...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Vendors</h1>

      {/* Search + Create */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search vendors..."
          className="border p-2 w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => {
            setSelectedVendor(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Vendor
        </button>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Vendor Name</th>
            <th className="p-3 text-left">Vendor ID</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredVendors?.map((vendor: any) => (
            <tr
              key={vendor.id}
              className="border-t hover:bg-gray-50"
            >
              <td
                className="p-3 cursor-pointer"
                onClick={() => navigate(`/vendors/${vendor.id}`)}
              >
                {vendor.name}
              </td>

              <td className="p-3">{vendor.id}</td>

              <td className="p-3">
                <button
                  className="text-blue-600"
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form */}
      {showForm && (
        <VendorForm
          vendor={selectedVendor}
          onClose={() => {
            setShowForm(false);
            setSelectedVendor(null);
          }}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default Vendors;