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
        <span>Product image</span>
        <input
          className="mt-1 w-full rounded border p-3"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>

      {isLoading && <p className="text-sm text-stone-500">Uploading image...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!value && (
        <p className="text-sm text-stone-500">
          Upload an image before saving the product.
        </p>
      )}
      {value && (
        <img
          src={value}
          alt="Product preview"
          className="h-28 w-28 rounded-lg border object-cover"
        />
      )}
    </div>
  );
};

export default CloudinaryImageUpload;



