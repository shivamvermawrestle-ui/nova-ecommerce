
import { useState } from "react";
import { useUploadProductImageMutation } from "../../services/productsApi";
import { UseGlob } from "../../Context/GlobalContext";

const CloudinaryImageUpload = ({ value, onChange }) => {
  const { dark } = UseGlob();

  const [uploadProductImage, { isLoading }] =
    useUploadProductImageMutation();

  const [error, setError] = useState("");

  // Theme colors
  const labelColor = dark ? "text-[#EAF0FA]" : "text-[#202C50]";

  const inputStyle = dark
    ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] file:bg-[#34415B] file:text-[#EAF0FA] hover:file:bg-[#35435C]"
    : "border-[#D8E1EF] bg-white text-[#202C50] file:bg-[#F7F9FC] file:text-[#344F82] hover:file:bg-[#D8E1EF]";

  const mutedText = dark ? "text-[#AAB8D0]" : "text-[#64718A]";

  const previewBorder = dark
    ? "border-[#35435C]"
    : "border-[#D8E1EF]";

  const errorColor = dark ? "text-[#F08089]" : "text-[#C04452]";

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
        reader.onerror = () =>
          reject(new Error("Could not read this image."));

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
        <span className={`text-sm font-medium ${labelColor}`}>
          Product image
        </span>

        <input
          className={`mt-1 w-full rounded-lg border p-3 text-sm transition-colors file:mr-4 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold ${inputStyle}`}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>

      {/* Uploading Status */}
      {isLoading && (
        <p className={`text-sm ${mutedText}`}>
          Uploading image...
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className={`text-sm ${errorColor}`}>
          {error}
        </p>
      )}

      {/* Upload Instructions */}
      {!value && (
        <p className={`text-sm ${mutedText}`}>
          Upload an image before saving the product.
        </p>
      )}

      {/* Image Preview */}
      {value && (
        <img
          src={value}
          alt="Product preview"
          className={`h-28 w-28 rounded-lg border object-cover ${previewBorder}`}
        />
      )}
    </div>
  );
};

export default CloudinaryImageUpload;
