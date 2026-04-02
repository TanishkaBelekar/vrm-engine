import type { Vendor } from "../../entities/vendor/types";

type Props = {
  vendor: Vendor | null;
  onClose: () => void;
};

const VendorDrawer = ({ vendor, onClose }: Props) => {

  if (!vendor) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6">

      <button onClick={onClose} className="mb-4 text-blue-600">
        Close
      </button>

      <h2 className="text-xl font-semibold mb-4">
        {vendor.name}
      </h2>

      <p>Category: {vendor.category}</p>
      <p>Risk Score: {vendor.riskScore}</p>
      <p>Status: {vendor.status}</p>

    </div>
  );
};

export default VendorDrawer;