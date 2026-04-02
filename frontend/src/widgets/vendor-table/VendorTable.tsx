import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Vendor } from "../../entities/vendor/types";

type Props = {
  vendors: Vendor[];
};

const VendorTable = ({ vendors }: Props) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search vendor..."
        className="border p-2 mb-4 w-full rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Vendor Table */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Category</th>
            <th className="p-3">Risk Score</th>
            <th className="p-3">Status</th>
            <th className="p-3">Owner</th>
          </tr>
        </thead>

        <tbody>
          {filteredVendors.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No vendors found
              </td>
            </tr>
          ) : (
            filteredVendors.map((vendor) => (
              <tr
                key={vendor.id}
                className="cursor-pointer hover:bg-gray-100 border-b"
                onClick={() => navigate(`/vendors/${vendor.id}`)}
              >
                <td className="p-3">{vendor.name}</td>
                <td className="p-3">{vendor.category}</td>
                <td className="p-3">{vendor.riskScore}</td>
                <td className="p-3">{vendor.status}</td>
                <td className="p-3">{vendor.owner}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VendorTable;