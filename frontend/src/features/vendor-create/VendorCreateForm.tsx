import { useForm } from "react-hook-form";
import { createVendor } from "../../entities/vendor/api";

const VendorCreateForm = () => {

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {

    try {
      await createVendor(data);
      alert("Vendor created");
    } catch {
      alert("Error creating vendor");
    }

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <input {...register("name")} placeholder="Vendor Name" />

      <input {...register("category")} placeholder="Category" />

      <button type="submit">Create Vendor</button>

    </form>
  );
};

export default VendorCreateForm;