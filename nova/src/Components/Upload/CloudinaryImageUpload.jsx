import { useState } from "react";
import { useUploadProductImageMutation } from "../../services/productsApi";

const CloudinaryImageUpload = ({ value, onChange }) => {
  const [uploadProductImage, { isLoading }] = useUploadProductImageMutation();
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("Image size must be 3 MB or less.");
      return;
    }

    try {
      const image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read this image."));
        reader.readAsDataURL(file);
      });

      const response = await uploadProductImage({ image }).unwrap();
      const secureUrl = response?.data?.secure_url;

      if (!secureUrl) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      onChange(secureUrl);
    } catch (uploadError) {
      setError(
        uploadError?.data?.message ||
          uploadError?.message ||
          "Image upload failed."
      );
    }
  };

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-sm font-medium text-[#202C50] dark:text-[#EAF0FA]">Product image</span>
        <input
          className="mt-1 w-full rounded-lg border border-[#C9D5E7] bg-white p-3 text-sm text-[#202C50] file:mr-4 file:rounded-md file:border-0 file:bg-[#DFE7F3] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#202C50] hover:file:bg-[#C9D5E7] dark:border-[#465570] dark:bg-[#202A40] dark:text-[#EAF0FA] dark:file:bg-[#34415B] dark:file:text-[#EAF0FA]"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>

      {isLoading && <p className="text-sm text-[#64718A] dark:text-[#AAB8D0]">Uploading image...</p>}
      {error && <p className="text-sm text-[#C04452] dark:text-[#F08089]">{error}</p>}
      {!value && (
        <p className="text-sm text-[#64718A] dark:text-[#AAB8D0]">
          Upload an image before saving the product.
        </p>
      )}
      {value && (
        <img
          src={value}
          alt="Product preview"
          className="h-28 w-28 rounded-lg border border-[#D8E1EF] dark:border-[#35435C] object-cover"
        />
      )}
    </div>
  );
};

export default CloudinaryImageUpload;



