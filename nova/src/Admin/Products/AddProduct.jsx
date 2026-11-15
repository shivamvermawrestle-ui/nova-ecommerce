import { useState } from "react";
import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import { useUploadProductMutation } from "../../services/productsApi";
import CloudinaryImageUpload from "../../Components/Upload/CloudinaryImageUpload";
import {
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  
  Upload,
} from "lucide-react";

const SUGGESTED_CATEGORIES = [
  "Electronics",
  "Audio",
  "Keyboards",
  "Accessories",
  "Gaming",
  "Smart Home",
];

const AddProduct = () => {
  const { navigate, dark, formatPrice } = UseGlob();
  const [uploadProduct, { isLoading, error }] = useUploadProductMutation();
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    productName: "",
    brandName: "",
    category: "",
    price: "",
    sellingPrice: "",
    description: "",
    productImage: "",
    stock: "",
    isFeatured: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.productImage.trim()) {
      setFormError("Please upload a product image before saving.");
      return;
    }

    const priceNum = Number(form.price);
    const sellingPriceNum = Number(form.sellingPrice);
    const stockNum = Number(form.stock);

    if (isNaN(priceNum) || priceNum < 0) {
      setFormError("Original price must be a valid positive number.");
      return;
    }

    if (isNaN(sellingPriceNum) || sellingPriceNum < 0) {
      setFormError("Selling price must be a valid positive number.");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setFormError("Stock quantity must be a non-negative number.");
      return;
    }

    const productData = {
      ...form,
      price: priceNum,
      stock: stockNum,
      sellingPrice: sellingPriceNum,
      productImage: [form.productImage.trim()],
    };

    try {
      await uploadProduct(productData).unwrap();
      navigate("/dashboard/products");
    } catch (uploadError) {
      console.error("Product upload failed:", uploadError);
      setFormError(
        uploadError?.data?.message ||
          "Could not add product. Please check the details and try again."
      );
    }
  };

  // Calculations for pricing preview
  const originalPrice = parseFloat(form.price) || 0;
  const sellingPrice = parseFloat(form.sellingPrice) || 0;
  const hasDiscount =
    originalPrice > 0 &&
    sellingPrice > 0 &&
    sellingPrice < originalPrice;

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : 0;

  const priceWarning =
    originalPrice > 0 &&
    sellingPrice > 0 &&
    sellingPrice > originalPrice;

  // Stock status calculation
  const stockNum = parseInt(form.stock, 10);

  const stockStatus =
    isNaN(stockNum) || stockNum <= 0
      ? {
          label: "Out of Stock",
          style: dark
            ? "text-[#F08089] bg-red-950/40"
            : "text-[#C04452] bg-red-100",
        }
      : stockNum <= 5
        ? {
            label: `Low Stock (${stockNum})`,
            style: dark
              ? "text-[#E6B66F] bg-amber-950/40"
              : "text-[#A66A22] bg-amber-100",
          }
        : {
            label: `In Stock (${stockNum})`,
            style: dark
              ? "text-[#65C995] bg-emerald-950/40"
              : "text-[#27845B] bg-emerald-100",
          };

  const inputClass = `w-full rounded-xl border p-2.5 text-sm outline-none transition-colors shadow-2xs ${
    dark
      ? "border-[#465570] bg-[#171E30] text-[#EAF0FA] placeholder-[#8190AA] focus:border-[#9BB2D8] focus:ring-2 focus:ring-[#9BB2D8]/20"
      : "border-[#C9D5E7] bg-white text-[#202C50] placeholder-[#8A96AA] focus:border-[#7895C5] focus:ring-2 focus:ring-[#7895C5]/20"
  }`;

  const labelClass = `text-xs font-semibold uppercase tracking-wider ${
    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
  }`;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              to="/dashboard/products"
              className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline ${
                dark ? "text-[#7895C5]" : "text-[#344F82]"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Products</span>
            </Link>
          </div>

          <h1
            className={`text-xl lg:text-2xl font-bold tracking-tight ${
              dark ? "text-[#EAF0FA]" : "text-[#202C50]"
            }`}
          >
            Add New Product
          </h1>

          <p
            className={`text-xs sm:text-sm mt-0.5 ${
              dark ? "text-[#8190AA]" : "text-[#64718A]"
            }`}
          >
            Create, price, and publish a new item to your online catalog.
          </p>
        </div>

        {/* Action Buttons Top Bar */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/products"
            className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
              dark
                ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
                : "border-[#C9D5E7] bg-white text-[#344F82] hover:bg-[#EDF2F9]"
            }`}
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`rounded-xl px-5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7895C5] disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 shadow-xs ${
              dark
                ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                : "bg-[#202C50] text-white hover:bg-[#344F82]"
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {(formError || error) && (
        <div
          role="alert"
          className={`flex items-center gap-3 rounded-2xl border p-4 text-xs sm:text-sm font-semibold ${
            dark
              ? "border-red-400/20 bg-red-950/40 text-[#F08089]"
              : "border-red-500/20 bg-red-50 text-[#C04452]"
          }`}
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            {formError || error?.data?.message || "Could not add product."}
          </span>
        </div>
      )}

      {/* Main Form Architecture: 2 Columns */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
      >
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Card: Basic Information */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors flex flex-col gap-4 ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                dark ? "border-[#35435C]" : "border-[#D8E1EF]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[#7895C5]" />

                <h2
                  className={`text-sm sm:text-base font-bold tracking-tight ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  General Information
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Product Title *</label>

              <input
                className={inputClass}
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="e.g. Minimalist Wireless Mechanical Keyboard"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Description *</label>

              <textarea
                className={`${inputClass} min-h-[120px] resize-y`}
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a comprehensive product description, technical specifications, and key features..."
                required
              />
            </div>
          </section>

          {/* Card: Media Studio */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors flex flex-col gap-4 ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                dark ? "border-[#35435C]" : "border-[#D8E1EF]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Upload className="w-4 h-4 text-[#7895C5]" />

                <h2
                  className={`text-sm sm:text-base font-bold tracking-tight ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  Product Media
                </h2>
              </div>

              <span
                className={`text-xs ${
                  dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                }`}
              >
                Cloudinary Asset
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <CloudinaryImageUpload
                value={form.productImage}
                onChange={(productImage) =>
                  setForm((previous) => ({ ...previous, productImage }))
                }
              />

              <p
                className={`text-[11px] ${
                  dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                }`}
              >
                Supported formats: PNG, JPG, WEBP. Maximum file size: 3 MB.
              </p>
            </div>
          </section>

          {/* Card: Pricing & Discounts */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors flex flex-col gap-4 ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                dark ? "border-[#35435C]" : "border-[#D8E1EF]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-[#7895C5]" />

                <h2
                  className={`text-sm sm:text-base font-bold tracking-tight ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  Pricing & Margins
                </h2>
              </div>

              {hasDiscount && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    dark
                      ? "bg-red-950/40 text-[#F08089]"
                      : "bg-red-100 text-[#B74747]"
                  }`}
                >
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Original Price (MSRP) *</label>

                <div className="relative">
                  <span
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold ${
                      dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                    }`}
                  >
                    $
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`${inputClass} pl-8`}
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Selling Price *</label>

                <div className="relative">
                  <span
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold ${
                      dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                    }`}
                  >
                    $
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`${inputClass} pl-8`}
                    name="sellingPrice"
                    value={form.sellingPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            {priceWarning && (
              <p
                className={`text-xs font-medium ${
                  dark ? "text-[#E6B66F]" : "text-[#A66A22]"
                }`}
              >
                Note: Selling price is currently higher than the original price.
              </p>
            )}

            {hasDiscount && (
              <div
                className={`rounded-xl p-3 text-xs flex items-center justify-between border ${
                  dark
                    ? "border-[#35435C] bg-[#171E30] text-[#AAB8D0]"
                    : "border-[#D8E1EF] bg-[#F7F9FC] text-[#64718A]"
                }`}
              >
                <span>Customer Savings per unit:</span>

                <span
                  className={`font-bold ${
                    dark ? "text-[#65C995]" : "text-[#27845B]"
                  }`}
                >
                  {formatPrice.format(originalPrice - sellingPrice)} (
                  {discountPercent}%)
                </span>
              </div>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Card: Organization & Category */}
          <section
            className={`rounded-2xl border p-5 shadow-sm transition-colors flex flex-col gap-4 ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div
              className={`flex items-center gap-2.5 pb-3 border-b ${
                dark ? "border-[#35435C]" : "border-[#D8E1EF]"
              }`}
            >
              <Layers className="w-4 h-4 text-[#7895C5]" />

              <h2
                className={`text-sm sm:text-base font-bold tracking-tight ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                Organization
              </h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Brand Name *</label>

              <input
                className={inputClass}
                name="brandName"
                value={form.brandName}
                onChange={handleChange}
                placeholder="e.g. Keychron, Apple, Sony"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Category *</label>

              <input
                className={inputClass}
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Keyboards"
                required
              />

              {/* Category Quick Suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {SUGGESTED_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, category: cat }))
                    }
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-medium border transition-colors ${
                      form.category === cat
                        ? dark
                          ? "bg-[#7895C5] text-[#171E30] border-[#7895C5]"
                          : "bg-[#202C50] text-white border-[#202C50]"
                        : dark
                          ? "border-[#35435C] bg-[#171E30] text-[#AAB8D0] hover:text-[#EAF0FA]"
                          : "border-[#D8E1EF] bg-[#F7F9FC] text-[#64718A] hover:text-[#202C50]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Card: Stock & Inventory */}
          <section
            className={`rounded-2xl border p-5 shadow-sm transition-colors flex flex-col gap-4 ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                dark ? "border-[#35435C]" : "border-[#D8E1EF]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-[#7895C5]" />

                <h2
                  className={`text-sm sm:text-base font-bold tracking-tight ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  Inventory
                </h2>
              </div>

              {form.stock !== "" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${stockStatus.style}`}
                >
                  {stockStatus.label}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Available Units in Stock *</label>

              <input
                type="number"
                min="0"
                step="1"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="e.g. 50"
                required
                className={inputClass}
              />
            </div>
          </section>

          {/* Card: Feature Spotlight Toggle */}
          <section
            className={`rounded-2xl border p-5 shadow-sm transition-colors ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={Boolean(form.isFeatured)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked,
                  }))
                }
                className={`mt-1 h-4 w-4 rounded ${
                  dark ? "accent-[#7895C5]" : "accent-[#202C50]"
                }`}
              />

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#E6B66F]" />

                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                    }`}
                  >
                    Feature in Showcase
                  </span>
                </div>

                <p
                  className={`text-[11px] mt-0.5 ${
                    dark ? "text-[#8190AA]" : "text-[#64718A]"
                  }`}
                >
                  Highlight this product in the homepage featured products carousel.
                </p>
              </div>
            </label>
          </section>

          {/* Card: Live Storefront Card Preview */}
          <section
            className={`rounded-2xl border p-5 shadow-sm transition-colors flex flex-col gap-3 ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div
              className={`flex items-center justify-between pb-2 border-b ${
                dark ? "border-[#35435C]" : "border-[#D8E1EF]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-[#7895C5]" />

                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                  }`}
                >
                  Card Live Preview
                </span>
              </div>

              <span
                className={`text-[10px] ${
                  dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                }`}
              >
                Storefront appearance
              </span>
            </div>

            {/* Mini preview card */}
            <div
              className={`rounded-2xl border overflow-hidden flex flex-col transition-all shadow-sm ${
                dark
                  ? "border-[#35435C] bg-[#171E30]"
                  : "border-[#D8E1EF] bg-[#F7F9FC]"
              }`}
            >
              <div className="relative aspect-square w-full rounded-t-2xl overflow-hidden bg-white/5 flex items-center justify-center">
                {form.productImage ? (
                  <img
                    src={form.productImage}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-t-2xl"
                  />
                ) : (
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                    }`}
                  >
                    <Package className="w-8 h-8 opacity-40" />
                    <span className="text-[10px]">No Image Uploaded</span>
                  </div>
                )}

                {hasDiscount && (
                  <span className="absolute top-2 left-2 rounded-md bg-[#B74747] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                    -{discountPercent}%
                  </span>
                )}

                {form.isFeatured && (
                  <span
                    className={`absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold shadow-xs ${
                      dark
                        ? "bg-[#7895C5] text-[#171E30]"
                        : "bg-[#202C50] text-white"
                    }`}
                  >
                    Featured
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-0.5 p-3.5">
                <span
                  className={`text-[10px] uppercase font-semibold tracking-wider ${
                    dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                  }`}
                >
                  {form.brandName || "Brand"}
                </span>

                <p
                  className={`text-xs font-bold line-clamp-1 ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  {form.productName || "Product Title"}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-sm font-bold ${
                      dark ? "text-[#7895C5]" : "text-[#202C50]"
                    }`}
                  >
                    {formatPrice.format(sellingPrice || 0)}
                  </span>

                  {hasDiscount && (
                    <span
                      className={`text-[11px] line-through ${
                        dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                      }`}
                    >
                      {formatPrice.format(originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7895C5] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs ${
              dark
                ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                : "bg-[#202C50] text-white hover:bg-[#344F82]"
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Publishing Product...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default AddProduct;