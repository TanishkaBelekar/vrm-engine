import { useState } from "react";
import { createVendor, updateVendor } from "@/entities/vendor/api";

type Props = {
  onClose: () => void;
  refetch: () => void;
  vendor?: any;
};

const VendorForm = ({ onClose, refetch, vendor }: Props) => {
  const [name, setName] = useState(vendor?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    //  Validation
    if (!trimmedName) {
      alert("Vendor name is required");
      return;
    }

    try {
      setLoading(true);

      if (vendor) {
        await updateVendor(vendor.id, { name: trimmedName });
        alert("Vendor updated successfully ");
      } else {
        await createVendor({ name: trimmedName });
        alert("Vendor created successfully ");
      }

      //  Refresh list
      refetch();

      // Reset form (clean UX)
      setName("");

      //  Close modal
      onClose();

    } catch (err: any) {
      console.error(err);

      //  Better error handling
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong ";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl mb-4">
          {vendor ? "Edit Vendor" : "Create Vendor"}
        </h2>

        <input
          type="text"
          className="border p-2 w-full mb-4"
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading} //  prevent typing while saving
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorForm;