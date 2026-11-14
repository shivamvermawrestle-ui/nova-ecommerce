import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import CloudinaryImageUpload from "../../Components/Upload/CloudinaryImageUpload";
import { UseGlob } from "../../Context/GlobalContext";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../services/productsApi";
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
  ExternalLink,
} from "lucide-react";

const SUGGESTED_CATEGORIES = [
  "Electronics",
  "Audio",
  "Keyboards",
  "Accessories",
  "Gaming",
  "Smart Home",
];

const createProductForm = (product) => ({
  productName: product.productName || "",
  brandName: product.brandName || "",
  category: product.category || "",
  price: String(product.price ?? ""),
  sellingPrice: String(product.sellingPrice ?? ""),
  description: product.description || "",
  productImage: product.productImage?.[0] || "",
  stock: String(product.stock ?? 0),
  isFeatured: Boolean(product.isFeatured),
});

const ProductEditForm = ({ id, product }) => {
  const { navigate, dark, formatPrice } = UseGlob();

  const [updateProduct, { isLoading: saving, error: saveError }] =
    useUpdateProductMutation();

  const [form, setForm] = useState(() => createProductForm(product));
  const [formError, setFormError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.productImage.trim()) {
      setFormError("Please upload or provide a product image before saving.");
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
      sellingPrice: sellingPriceNum,
      stock: stockNum,
      productImage: [form.productImage.trim()],
    };

    try {
      await updateProduct({
        _id: id,
        ...productData,
      }).unwrap();

      navigate("/dashboard/products");
    } catch (error) {
      console.error("Product update failed:", error);
      setFormError(
        error?.data?.message ||
          "Could not update product. Please check the values and try again."
      );
    }
  };

  // Pricing calculations
  const originalPrice = parseFloat(form.price) || 0;
  const sellingPrice = parseFloat(form.sellingPrice) || 0;
  const hasDiscount = originalPrice > 0 && sellingPrice > 0 && sellingPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : 0;
  const priceWarning = originalPrice > 0 && sellingPrice > 0 && sellingPrice > originalPrice;

  // Stock status calculation
  const stockNum = parseInt(form.stock, 10);
  const stockStatus =
    isNaN(stockNum) || stockNum <= 0
      ? { label: "Out of Stock", style: "text-[#C04452] dark:text-[#F08089] bg-red-100 dark:bg-red-950/40" }
      : stockNum <= 5
      ? { label: `Low Stock (${stockNum})`, style: "text-[#A66A22] dark:text-[#E6B66F] bg-amber-100 dark:bg-amber-950/40" }
      : { label: `In Stock (${stockNum})`, style: "text-[#27845B] dark:text-[#65C995] bg-emerald-100 dark:bg-emerald-950/40" };

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
      {/* Top Header & Breadcrumbs */}
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
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1
              className={`text-xl lg:text-2xl font-bold tracking-tight ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              Edit Product
            </h1>
            <span
              className={`font-mono text-xs px-2.5 py-0.5 rounded-full border ${
                dark
                  ? "border-[#35435C] bg-[#171E30] text-[#8190AA]"
                  : "border-[#D8E1EF] bg-[#F7F9FC] text-[#64718A]"
              }`}
            >
              #{id.slice(-6).toUpperCase()}
            </span>
          </div>
          <p
            className={`text-xs sm:text-sm mt-0.5 ${
              dark ? "text-[#8190AA]" : "text-[#64718A]"
            }`}
          >
            Update catalog details, pricing, media assets, and visibility.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to={`/product/${id}`}
            target="_blank"
            className={`rounded-xl border px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              dark
                ? "border-[#465570] bg-[#202A40] text-[#AAB8D0] hover:text-[#EAF0FA] hover:bg-[#2D3B56]"
                : "border-[#C9D5E7] bg-white text-[#64718A] hover:text-[#202C50] hover:bg-[#EDF2F9]"
            }`}
            title="View product in storefront"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View in Store</span>
          </Link>

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
            disabled={saving}
            className="rounded-xl bg-[#202C50] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#344F82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7895C5] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#7895C5] dark:text-[#171E30] dark:hover:bg-[#9BB2D8] flex items-center gap-2 shadow-xs"
          >
            {saving ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Error Callout Banner */}
      {(formError || saveError) && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs sm:text-sm font-semibold text-[#C04452] dark:text-[#F08089]"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{formError || saveError?.data?.message || "Could not update product."}</span>
        </div>
      )}

      {/* Main Studio Form: 2-Column Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols): Core Product Details & Media & Pricing */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Card: Basic Information */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors flex flex-col gap-4 ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b dark:border-[#35435C] border-[#D8E1EF]">
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
                placeholder="Product name"
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
                placeholder="Detailed description of the product..."
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
            <div className="flex items-center justify-between pb-3 border-b dark:border-[#35435C] border-[#D8E1EF]">
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
                  setForm((previousForm) => ({ ...previousForm, productImage }))
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

          {/* Card: Pricing & Profitability */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors flex flex-col gap-4 ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b dark:border-[#35435C] border-[#D8E1EF]">
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
                <span className="rounded-full bg-red-100 text-[#B74747] dark:bg-red-950/40 dark:text-[#F08080] px-2.5 py-0.5 text-xs font-bold">
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
              <p className="text-xs text-amber-500 font-medium">
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
                <span className="font-bold text-[#27845B] dark:text-[#65C995]">
                  {formatPrice.format(originalPrice - sellingPrice)} ({discountPercent}%)
                </span>
              </div>
            )}
          </section>
        </div>

        {/* Right Column (1 Col): Organization + Inventory + Feature Switch + Real-Time Preview */}
        <div className="flex flex-col gap-6">
          {/* Card: Organization & Classification */}
          <section
            className={`rounded-2xl border p-5 shadow-sm transition-colors flex flex-col gap-4 ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div className="flex items-center gap-2.5 pb-3 border-b dark:border-[#35435C] border-[#D8E1EF]">
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
                placeholder="Brand name"
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
                placeholder="Category name"
                required
              />

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {SUGGESTED_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
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

          {/* Card: Stock & Inventory Management */}
          <section
            className={`rounded-2xl border p-5 shadow-sm transition-colors flex flex-col gap-4 ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b dark:border-[#35435C] border-[#D8E1EF]">
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
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${stockStatus.style}`}>
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
                placeholder="0"
                required
                className={inputClass}
              />
            </div>
          </section>

          {/* Card: Featured Spotlight Toggle */}
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
                id="editIsFeatured"
                checked={Boolean(form.isFeatured)}
                onChange={(event) =>
                  setForm((previousForm) => ({
                    ...previousForm,
                    isFeatured: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded accent-[#202C50] dark:accent-[#7895C5]"
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
            <div className="flex items-center justify-between pb-2 border-b dark:border-[#35435C] border-[#D8E1EF]">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-[#7895C5]" />
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                  }`}
                >
                  Live Card Preview
                </span>
              </div>
              <span className="text-[10px] text-[#8190AA]">Storefront appearance</span>
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
                  <span className="absolute top-2 right-2 rounded-md bg-[#202C50] text-white dark:bg-[#7895C5] dark:text-[#171E30] px-1.5 py-0.5 text-[9px] font-bold shadow-xs">
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
                    <span className="text-[11px] text-[#8A96AA] line-through">
                      {formatPrice.format(originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Save Action */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#202C50] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#344F82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7895C5] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#7895C5] dark:text-[#171E30] dark:hover:bg-[#9BB2D8] flex items-center justify-center gap-2 shadow-xs"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

const ProductEdit = () => {
  const { id } = useParams();
  const { dark } = UseGlob();

  const {
    data: product,
    isLoading: productLoading,
    isError: productIsError,
    error: productError,
  } = useGetProductDetailsQuery(id);

  if (productLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="h-10 w-10 border-4 border-[#D8E1EF] border-t-[#202C50] dark:border-[#35435C] dark:border-t-[#7895C5] rounded-full animate-spin" />
        <p className={`text-sm font-medium ${dark ? "text-[#8190AA]" : "text-[#64718A]"}`}>
          Loading product details...
        </p>
      </div>
    );
  }

  if (productIsError || !product) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <Link
          to="/dashboard/products"
          className={`inline-flex items-center gap-2 text-xs font-semibold hover:underline mb-6 ${
            dark ? "text-[#7895C5]" : "text-[#344F82]"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <div
          className={`rounded-2xl border p-12 text-center flex flex-col items-center gap-3 ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
              : "border-[#D8E1EF] bg-white text-[#202C50]"
          }`}
        >
          <AlertCircle className="w-10 h-10 text-[#C04452] dark:text-[#F08089]" />
          <h2 className="text-xl font-bold">Could not load product</h2>
          <p className={`text-sm ${dark ? "text-[#8190AA]" : "text-[#64718A]"}`}>
            {productError?.data?.message || "Product not found or has been removed."}
          </p>
          <Link
            to="/dashboard/products"
            className="mt-2 rounded-xl bg-[#202C50] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#344F82] dark:bg-[#7895C5] dark:text-[#171E30] dark:hover:bg-[#9BB2D8] transition-colors"
          >
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  return <ProductEditForm key={id} id={id} product={product} />;
};

export default ProductEdit;
