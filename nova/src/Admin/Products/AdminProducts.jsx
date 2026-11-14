import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../services/productsApi";
import { UseGlob } from "../../Context/GlobalContext";
import {
  Plus,
  Search,
  Package,
  Trash2,
  Pencil,
  ExternalLink,
  AlertCircle,
  Sparkles,
  X,
  ArrowUpDown,
  Tag,
} from "lucide-react";

const AdminProducts = () => {
  const { formatPrice, dark } = UseGlob();
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useGetProductsQuery();

  const [deleteProduct, { isLoading: isDeletingGlobal, error: deleteError }] =
    useDeleteProductMutation();
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.productName}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    setDeletingId(product._id);
    try {
      await deleteProduct(product._id).unwrap();
    } catch (err) {
      console.error("Product delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Extract unique sorted categories
  const categories = useMemo(() => {
    return [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
  }, [products]);

  // Statistics calculation for KPI badges
  const stats = useMemo(() => {
    const inStock = products.filter((p) => Number(p.stock ?? 0) > 5).length;
    const lowStock = products.filter((p) => {
      const s = Number(p.stock ?? 0);
      return s > 0 && s <= 5;
    }).length;
    const outOfStock = products.filter((p) => Number(p.stock ?? 0) === 0).length;
    const totalInventoryValue = products.reduce((acc, p) => {
      return acc + (Number(p.sellingPrice) || 0) * (Number(p.stock) || 0);
    }, 0);

    return {
      total: products.length,
      inStock,
      lowStock,
      outOfStock,
      totalInventoryValue,
    };
  }, [products]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setStockFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const searchableText = [
        product._id,
        product.productName,
        product.category,
        product.brandName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const stock = Number(product.stock ?? 0);

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && stock > 5) ||
        (stockFilter === "low-stock" && stock > 0 && stock <= 5) ||
        (stockFilter === "out-of-stock" && stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "price_asc") {
        return (Number(a.sellingPrice) || 0) - (Number(b.sellingPrice) || 0);
      }
      if (sortBy === "price_desc") {
        return (Number(b.sellingPrice) || 0) - (Number(a.sellingPrice) || 0);
      }
      if (sortBy === "stock_desc") {
        return (Number(b.stock) || 0) - (Number(a.stock) || 0);
      }
      if (sortBy === "name_asc") {
        return (a.productName || "").localeCompare(b.productName || "");
      }
      return 0;
    });
  }, [products, search, selectedCategory, stockFilter, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage]);

  const hasActiveFilters = search || selectedCategory || stockFilter !== "all" || sortBy !== "newest";

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="h-10 w-10 border-4 border-[#D8E1EF] border-t-[#202C50] dark:border-[#35435C] dark:border-t-[#7895C5] rounded-full animate-spin" />
        <p className={`text-sm font-medium ${dark ? "text-[#8190AA]" : "text-[#64718A]"}`}>
          Loading product catalog...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div
          className={`rounded-2xl border p-12 text-center flex flex-col items-center gap-3 ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
              : "border-[#D8E1EF] bg-white text-[#202C50]"
          }`}
        >
          <AlertCircle className="w-10 h-10 text-[#C04452] dark:text-[#F08089]" />
          <h2 className="text-xl font-bold">Could not load products</h2>
          <p className={`text-sm ${dark ? "text-[#8190AA]" : "text-[#64718A]"}`}>
            {error?.data?.message || "An error occurred while fetching the catalog."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1
              className={`text-xl lg:text-2xl font-bold tracking-tight ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              Product Catalog
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                dark
                  ? "bg-[#34415B] text-[#7895C5]"
                  : "bg-[#DFE7F3] text-[#202C50]"
              }`}
            >
              {products.length}
            </span>
          </div>
          <p
            className={`text-xs sm:text-sm mt-0.5 ${
              dark ? "text-[#8190AA]" : "text-[#64718A]"
            }`}
          >
            Manage inventory levels, prices, categories, and storefront visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`hidden md:block rounded-xl border px-3.5 py-2 text-right ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <p
              className={`text-[10px] uppercase font-semibold tracking-wider ${
                dark ? "text-[#8190AA]" : "text-[#64718A]"
              }`}
            >
              Total Inventory Value
            </p>
            <p
              className={`text-base font-bold ${
                dark ? "text-[#7895C5]" : "text-[#202C50]"
              }`}
            >
              {formatPrice.format(stats.totalInventoryValue)}
            </p>
          </div>

          <Link
            to="/dashboard/add-product"
            className="bg-[#202C50] hover:bg-[#344F82] dark:bg-[#7895C5] dark:text-[#171E30] dark:hover:bg-[#9BB2D8] text-nowrap px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Quick Status Filter Tabs */}
      <div className="grid grid-cols-2  md:grid-cols-4  gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: "All Items", count: stats.total },
          { id: "in-stock", label: "In Stock (>5)", count: stats.inStock },
          { id: "low-stock", label: "Low Stock (1–5)", count: stats.lowStock },
          { id: "out-of-stock", label: "Out of Stock (0)", count: stats.outOfStock },
        ].map((tab) => {
          const isActive = stockFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStockFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 rounded-xl justify-center px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? dark
                    ? "bg-[#7895C5] text-[#171E30] border-[#7895C5] shadow-xs"
                    : "bg-[#202C50] text-white border-[#202C50] shadow-xs"
                  : dark
                  ? "bg-[#202A40] text-[#AAB8D0] border-[#35435C] hover:bg-[#2D3B56] hover:text-[#EAF0FA]"
                  : "bg-white text-[#64718A] border-[#D8E1EF] hover:bg-[#EDF2F9] hover:text-[#202C50]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? dark
                      ? "bg-[#171E30] text-[#7895C5]"
                      : "bg-white text-[#202C50]"
                    : dark
                    ? "bg-[#171E30] text-[#8190AA]"
                    : "bg-[#DFE7F3] text-[#64718A]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar Controls */}
      <div
        className={`rounded-2xl border p-4 shadow-sm transition-colors flex flex-col md:flex-row   items-stretch md:items-center gap-3 ${
          dark
            ? "border-[#35435C] bg-[#202A40]"
            : "border-[#D8E1EF] bg-white"
        }`}
      >
        {/* Search input with icon */}
        <div className="relative  w-full flex-1">
          <Search
            className={`absolute  left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
              dark ? "text-[#8190AA]" : "text-[#8A96AA]"
            }`}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product name, category, brand, or ID..."
            className={`w-full rounded-xl border pl-10 pr-9 py-2 text-xs sm:text-sm outline-none transition-colors shadow-2xs ${
              dark
                ? "bg-[#171E30] border-[#465570] text-[#EAF0FA] placeholder-[#8190AA] focus:border-[#9BB2D8]"
                : "bg-[#F7F9FC] border-[#C9D5E7] text-[#202C50] placeholder-[#8A96AA] focus:border-[#7895C5]"
            }`}
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A96AA] hover:text-[#202C50] dark:hover:text-[#EAF0FA]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdowns row */}
        <div className="flex   items-center gap-2.5">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className={`rounded-xl border  w-full px-3 py-2 text-xs font-medium outline-none transition-colors shadow-2xs ${
              dark
                ? "bg-[#171E30] border-[#465570] text-[#EAF0FA] focus:border-[#9BB2D8]"
                : "bg-[#F7F9FC] border-[#C9D5E7] text-[#202C50] focus:border-[#7895C5]"
            }`}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown
              className={`h-3.5 w-3.5 hidden sm:block ${
                dark ? "text-[#8190AA]" : "text-[#8A96AA]"
              }`}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`rounded-xl border w-full  px-3 py-2 text-xs font-medium outline-none transition-colors shadow-2xs ${
                dark
                  ? "bg-[#171E30] border-[#465570] text-[#EAF0FA] focus:border-[#9BB2D8]"
                  : "bg-[#F7F9FC] border-[#C9D5E7] text-[#202C50] focus:border-[#7895C5]"
              }`}
            >
              <option value="newest">Newest First</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock_desc">Highest Stock</option>
            </select>
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold flex items-center gap-1 transition-colors ${
                dark
                  ? "border-[#35435C] bg-[#171E30] text-[#7895C5] hover:bg-[#2D3B56]"
                  : "border-[#D8E1EF] bg-white text-[#344F82] hover:bg-[#EDF2F9]"
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {deleteError && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs sm:text-sm font-semibold text-[#C04452] dark:text-[#F08089] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{deleteError.data?.message || "Could not delete product."}</span>
        </div>
      )}

      {/* Products Table Container */}
      {filteredAndSortedProducts.length === 0 ? (
        <div
          className={`rounded-2xl border p-12 text-center flex flex-col items-center gap-3 ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#8190AA]"
              : "border-[#D8E1EF] bg-white text-[#64718A]"
          }`}
        >
          <Package className="w-10 h-10 text-[#8A96AA] dark:text-[#8190AA]" />
          <h3 className="text-base font-bold">No products found</h3>
          <p className="text-xs max-w-sm">
            {hasActiveFilters
              ? "No products match your current filter and search criteria. Try adjusting or clearing your filters."
              : "Your catalog is empty. Click below to add your first product."}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-2 rounded-xl bg-[#202C50] px-4 py-2 text-xs font-semibold text-white hover:bg-[#344F82] dark:bg-[#7895C5] dark:text-[#171E30] dark:hover:bg-[#9BB2D8] transition-colors"
            >
              Clear all filters
            </button>
          ) : (
            <Link
              to="/dashboard/add-product"
              className="mt-2 rounded-xl bg-[#202C50] px-4 py-2 text-xs font-semibold text-white hover:bg-[#344F82] dark:bg-[#7895C5] dark:text-[#171E30] dark:hover:bg-[#9BB2D8] transition-colors"
            >
              + Add Product
            </Link>
          )}
        </div>
      ) : (
        <div
          className={`overflow-hidden rounded-2xl border shadow-sm transition-colors ${
            dark ? "border-[#35435C] bg-[#202A40]" : "border-[#D8E1EF] bg-white"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] table-auto border-collapse">
              <thead>
                <tr
                  className={`border-b text-xs font-semibold uppercase tracking-wider ${
                    dark
                      ? "border-[#35435C] bg-[#26334D] text-[#AAB8D0]"
                      : "border-[#D8E1EF] bg-[#DFE7F3] text-[#64718A]"
                  }`}
                >
                  <th className="px-4 py-3.5 text-left">Product</th>
                  <th className="px-3 py-3.5 text-left">Category</th>
                  <th className="px-3 py-3.5 text-center">Original</th>
                  <th className="px-3 py-3.5 text-center">Selling Price</th>
                  <th className="px-3 py-3.5 text-center">Stock</th>
                  <th className="px-4 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs sm:text-sm ${
                  dark ? "divide-[#35435C]/60" : "divide-[#D8E1EF]"
                }`}
              >
                {paginatedProducts.map((product) => {
                  const origPrice = Number(product.price || 0);
                  const sellPrice = Number(product.sellingPrice || 0);
                  const hasDiscount = origPrice > 0 && sellPrice > 0 && sellPrice < origPrice;
                  const discountPercent = hasDiscount
                    ? Math.round(((origPrice - sellPrice) / origPrice) * 100)
                    : 0;
                  const stock = Number(product.stock ?? 0);
                  const isDeleting = deletingId === product._id;

                  return (
                    <tr
                      key={product._id}
                      className={`transition-colors ${
                        dark ? "hover:bg-[#2D3B56]" : "hover:bg-[#EDF2F9]"
                      }`}
                    >
                      {/* Product Thumbnail & Details */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.productImage?.[0] ? (
                            <img
                              src={product.productImage[0]}
                              alt={product.productName}
                              className={`h-12 w-12 rounded-xl object-cover shrink-0 border ${
                                dark
                                  ? "border-[#35435C] bg-[#171E30]"
                                  : "border-[#D8E1EF] bg-white"
                              }`}
                            />
                          ) : (
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold shrink-0 ${
                                dark
                                  ? "bg-[#171E30] text-[#7895C5] border border-[#35435C]"
                                  : "bg-[#DFE7F3] text-[#202C50] border border-[#D8E1EF]"
                              }`}
                            >
                              {product.productName?.charAt(0) || "P"}
                            </div>
                          )}

                          <div className="flex flex-col min-w-0 max-w-[280px]">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Link
                                to={`/dashboard/products/${product._id}/edit`}
                                className={`font-semibold line-clamp-1 hover:underline ${
                                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                                }`}
                                title={product.productName}
                              >
                                {product.productName}
                              </Link>
                              {product.isFeatured && (
                                <span className="inline-flex items-center gap-0.5 rounded-md bg-[#DFE7F3] dark:bg-[#34415B] px-1.5 py-0.2 text-[9px] font-bold text-[#202C50] dark:text-[#7895C5]">
                                  <Sparkles className="w-2.5 h-2.5 text-[#E6B66F]" />
                                  <span>Featured</span>
                                </span>
                              )}
                            </div>
                            <div
                              className={`flex items-center gap-2 text-xs mt-0.5 ${
                                dark ? "text-[#8190AA]" : "text-[#64718A]"
                              }`}
                            >
                              <span>{product.brandName || "Generic"}</span>
                              <span>·</span>
                              <span className="font-mono text-[11px] opacity-75">
                                #{product._id.slice(-6)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td
                        className={`px-3 py-3 text-left whitespace-nowrap ${
                          dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                        }`}
                      >
                        <span
                          className={`rounded-lg px-2 py-1 text-xs font-medium border ${
                            dark
                              ? "border-[#35435C] bg-[#171E30] text-[#AAB8D0]"
                              : "border-[#D8E1EF] bg-[#F7F9FC] text-[#64718A]"
                          }`}
                        >
                          {product.category || "Uncategorized"}
                        </span>
                      </td>

                      {/* Original Price */}
                      <td
                        className={`px-3 py-3 text-center whitespace-nowrap ${
                          dark ? "text-[#8190AA]" : "text-[#64718A]"
                        }`}
                      >
                        {origPrice > 0 ? (
                          <span className={hasDiscount ? "line-through opacity-75" : ""}>
                            {formatPrice.format(origPrice)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Selling Price */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center">
                          <span
                            className={`font-bold ${
                              dark ? "text-[#7895C5]" : "text-[#202C50]"
                            }`}
                          >
                            {formatPrice.format(sellPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="rounded-md bg-red-100 dark:bg-red-950/40 text-[#B74747] dark:text-[#F08080] px-1.5 py-0.2 text-[10px] font-bold mt-0.5">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Status Badge */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {stock === 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-[#C04452] dark:bg-red-950/40 dark:text-[#F08089]">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            <span>Out of stock</span>
                          </span>
                        ) : stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-[#A66A22] dark:bg-amber-950/40 dark:text-[#E6B66F]">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            <span>Low stock ({stock})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-[#27845B] dark:bg-emerald-950/40 dark:text-[#65C995]">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>{stock} in stock</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/product/${product._id}`}
                            className={`rounded-lg p-1.5 text-xs font-semibold transition-colors border ${
                              dark
                                ? "border-[#465570] bg-[#171E30] text-[#AAB8D0] hover:text-[#EAF0FA] hover:bg-[#2D3B56]"
                                : "border-[#C9D5E7] bg-white text-[#64718A] hover:text-[#202C50] hover:bg-[#EDF2F9]"
                            }`}
                            title="View in storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            to={`/dashboard/products/${product._id}/edit`}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors border flex items-center gap-1 ${
                              dark
                                ? "border-[#465570] bg-[#171E30] text-[#EAF0FA] hover:bg-[#2D3B56]"
                                : "border-[#C9D5E7] bg-white text-[#344F82] hover:bg-[#EDF2F9]"
                            }`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            disabled={isDeleting}
                            className="rounded-lg border border-red-500/30 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-[#C04452] transition-colors hover:bg-red-100 dark:bg-red-950/30 dark:text-[#F08089] dark:hover:bg-red-950/50 flex items-center gap-1 disabled:opacity-50"
                            title="Delete product"
                          >
                            {isDeleting ? (
                              <div className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination and Table Footer */}
          <div
            className={`border-t px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
              dark
                ? "border-[#35435C] bg-[#171E30]/40 text-[#8190AA]"
                : "border-[#D8E1EF] bg-[#F7F9FC]/80 text-[#64718A]"
            }`}
          >
            <div>
              Showing{" "}
              <span
                className={`font-semibold ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filteredAndSortedProducts.length
                )}
              </span>{" "}
              to{" "}
              <span
                className={`font-semibold ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAndSortedProducts.length
                )}
              </span>{" "}
              of{" "}
              <span
                className={`font-semibold ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {filteredAndSortedProducts.length}
              </span>{" "}
              products
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`rounded-lg border px-2.5 py-1 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    dark
                      ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
                      : "border-[#C9D5E7] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-7 w-7 rounded-lg text-xs font-semibold transition-colors ${
                        isCurrent
                          ? dark
                            ? "bg-[#7895C5] text-[#171E30]"
                            : "bg-[#202C50] text-white"
                          : dark
                          ? "hover:bg-[#2D3B56] text-[#AAB8D0]"
                          : "hover:bg-[#EDF2F9] text-[#64718A]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`rounded-lg border px-2.5 py-1 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    dark
                      ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
                      : "border-[#C9D5E7] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminProducts;
