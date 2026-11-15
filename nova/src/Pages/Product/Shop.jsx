import ProductCard from "../../Components/Product/ProductCard";
import ProductCardSkeleton from "../../Components/Product/ProductCardSkeleton";
import usePageTitle from "../../hooks/usePageTitle";
import { useGetPaginatedProductsQuery } from "../../services/productsApi";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  PackageSearch,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";

const PAGE_SIZE = 12;

const generatePaginationPages = (current, total) => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }

  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
};

const Shop = () => {
  const { dark } = UseGlob();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const searchTerm = searchParams.get("q") || "";
  const sortBy = searchParams.get("sort") || "newest";

  const pageFromUrl = Number(searchParams.get("page"));

  const currentPage =
    Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  usePageTitle(
    searchTerm
      ? `Search: "${searchTerm}"`
      : activeCategory
        ? `${activeCategory} Products`
        : "Shop Collection",
    searchTerm
      ? `Browse products matching "${searchTerm}".`
      : activeCategory
        ? `Explore our handpicked ${activeCategory} collection.`
        : "Browse the entire Nova product collection.",
  );

  // Theme colors
  const pageBg = dark ? "bg-[#171E30]" : "bg-[#F7F9FC]";
  const cardBg = dark ? "bg-[#202A40]" : "bg-white";

  const borderColor = dark ? "border-[#35435C]" : "border-[#D8E1EF]";

  const textPrimary = dark ? "text-[#EAF0FA]" : "text-[#202C50]";
  const textSecondary = dark ? "text-[#AAB8D0]" : "text-[#64718A]";
  const textMuted = dark ? "text-[#8190AA]" : "text-[#8A96AA]";
  const accentText = dark ? "text-[#7895C5]" : "text-[#344F82]";

  const primaryButton = dark
    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
    : "bg-[#202C50] text-white hover:bg-[#344F82]";

  const secondaryButton = dark
    ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
    : "border-[#D8E1EF] bg-white text-[#202C50] hover:bg-[#EDF2F9]";

  const updateShopUrl = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      const isDefaultPage = key === "page" && Number(value) === 1;
      const isDefaultSort = key === "sort" && value === "newest";

      if (value == null || value === "" || isDefaultPage || isDefaultSort) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams);
  };

  const {
    currentData: productsResponse,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPaginatedProductsQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    search: searchTerm,
    category: activeCategory,
    sort: sortBy,
  });

  const products = productsResponse?.data ?? [];
  const pagination = productsResponse?.pagination;

  const removeFilter = (filterKey) => {
    updateShopUrl({ [filterKey]: "", page: 1 });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Error State
  if (isError && !productsResponse) {
    return (
      <main
        className={`min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 py-20 text-center ${pageBg}`}
      >
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-2xl border ${
            dark
              ? "bg-[#F08089]/10 border-[#F08089]/20 text-[#F08089]"
              : "bg-[#C04452]/10 border-[#C04452]/20 text-[#C04452]"
          }`}
        >
          <RefreshCw className="w-8 h-8" />
        </div>

        <h1 className={`text-2xl font-bold ${textPrimary}`}>
          Unable to Load Products
        </h1>

        <p className={`text-sm max-w-md ${textSecondary}`}>
          {error?.data?.message ||
            error?.error ||
            "There may be a network issue. Please try again."}
        </p>

        <button
          type="button"
          onClick={refetch}
          className={`mt-4 px-6 py-3 rounded-xl font-bold text-sm transition-all ${primaryButton}`}
        >
          <span className="inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </span>
        </button>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-7 sm:py-10 lg:py-12 flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <section
          className={`flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b ${borderColor}`}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${accentText}`}
              >
                Curated Selection
              </span>

              <span
                className={`w-1 h-1 rounded-full ${
                  dark ? "bg-[#465570]" : "bg-[#D8E1EF]"
                }`}
              />

              <span className={`text-xs font-medium ${textSecondary}`}>
                {pagination?.totalProducts ?? products.length} items available
              </span>
            </div>

            <h1
              className={`mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight capitalize ${textPrimary}`}
            >
              {searchTerm
                ? `Results for "${searchTerm}"`
                : activeCategory
                  ? `${activeCategory} Collection`
                  : "Explore All Products"}
            </h1>

            <p
              className={`mt-2 text-xs sm:text-sm max-w-xl leading-relaxed ${textSecondary}`}
            >
              Browse our highest quality products, handpicked with guaranteed
              satisfaction and fast delivery.
            </p>
          </div>

          {/* Sort Control */}
          <div className="w-full lg:w-auto">
            <div
              className={`flex items-center justify-between sm:justify-start gap-3 rounded-xl border px-3.5 py-3 shadow-sm transition-colors ${cardBg} ${borderColor}`}
            >
              <div className="flex items-center gap-2">
                <ArrowUpDown className={`w-4 h-4 ${accentText}`} />

                <label
                  htmlFor="sort-select"
                  className={`text-xs font-semibold ${textSecondary}`}
                >
                  Sort by:
                </label>
              </div>

              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) =>
                  updateShopUrl({ sort: e.target.value, page: 1 })
                }
                className={`min-w-0 bg-transparent outline-none cursor-pointer text-xs sm:text-sm font-semibold ${textPrimary}`}
              >
                <option
                  value="newest"
                  className={dark ? "bg-[#202A40]" : "bg-white"}
                >
                  Newest Arrivals
                </option>

                <option
                  value="price-low"
                  className={dark ? "bg-[#202A40]" : "bg-white"}
                >
                  Price: Low to High
                </option>

                <option
                  value="price-high"
                  className={dark ? "bg-[#202A40]" : "bg-white"}
                >
                  Price: High to Low
                </option>

                <option
                  value="name-asc"
                  className={dark ? "bg-[#202A40]" : "bg-white"}
                >
                  Name: A to Z
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Active Filters */}
        {(activeCategory || searchTerm) && (
          <section className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 ${textSecondary}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters:
            </span>

            {activeCategory && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border capitalize ${cardBg} ${borderColor} ${textPrimary}`}
              >
                <span>Category: {activeCategory}</span>

                <button
                  type="button"
                  onClick={() => removeFilter("category")}
                  aria-label="Remove category filter"
                  className={`rounded-full p-0.5 transition-colors ${
                    dark ? "hover:bg-white/10" : "hover:bg-black/10"
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {searchTerm && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border ${cardBg} ${borderColor} ${textPrimary}`}
              >
                <span>Search: "{searchTerm}"</span>

                <button
                  type="button"
                  onClick={() => removeFilter("q")}
                  aria-label="Remove search filter"
                  className={`rounded-full p-0.5 transition-colors ${
                    dark ? "hover:bg-white/10" : "hover:bg-black/10"
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className={`text-xs font-bold underline transition-colors ml-1 ${accentText} ${
                dark ? "hover:text-[#9BB2D8]" : "hover:text-[#202C50]"
              }`}
            >
              Clear All
            </button>
          </section>
        )}

        {/* Product Grid / Loading / Empty States */}
        {isLoading && !productsResponse ? (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </section>
        ) : products.length === 0 ? (
          <section
            className={`my-6 sm:my-12 rounded-3xl border p-7 sm:p-12 text-center max-w-lg mx-auto w-full transition-colors shadow-sm ${cardBg} ${borderColor}`}
          >
            <div
              className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-5 ${
                dark
                  ? "bg-[#171E30] border-[#35435C] text-[#7895C5]"
                  : "bg-[#F7F9FC] border-[#D8E1EF] text-[#344F82]"
              }`}
            >
              <PackageSearch className="w-8 h-8 stroke-[1.8]" />
            </div>

            <h2 className={`text-lg sm:text-xl font-bold ${textPrimary}`}>
              No Products Found
            </h2>

            <p
              className={`mt-2 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed ${textSecondary}`}
            >
              {searchTerm
                ? `We couldn't find any products matching "${searchTerm}". Try checking your spelling or using different keywords.`
                : "No products match the selected criteria."}
            </p>

            <button
              type="button"
              onClick={clearAllFilters}
              className={`mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${primaryButton}`}
            >
              <RefreshCw className="w-4 h-4" />
              Reset All Filters
            </button>
          </section>
        ) : (
          <div className="relative">
            {/* Fetching Indicator */}
            {isFetching && (
              <div
                className={`absolute inset-0 z-10 rounded-2xl backdrop-blur-[1px] pointer-events-none transition-opacity ${
                  dark ? "bg-[#171E30]/40" : "bg-white/50"
                }`}
              />
            )}

            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </section>
          </div>
        )}

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <nav
            aria-label="Product pages"
            className={`mt-5 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-5 border-t pt-6 ${borderColor}`}
          >
            <p
              className={`text-xs sm:text-sm text-center sm:text-left ${textSecondary}`}
            >
              Showing{" "}
              <span className={`font-bold ${textPrimary}`}>
                {Math.min(
                  (currentPage - 1) * PAGE_SIZE + 1,
                  pagination.totalProducts,
                )}
              </span>{" "}
              to{" "}
              <span className={`font-bold ${textPrimary}`}>
                {Math.min(currentPage * PAGE_SIZE, pagination.totalProducts)}
              </span>{" "}
              of{" "}
              <span className={`font-bold ${textPrimary}`}>
                {pagination.totalProducts}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {/* Previous */}
              <button
                type="button"
                onClick={() => {
                  updateShopUrl({ page: currentPage - 1 });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${secondaryButton}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              {generatePaginationPages(currentPage, pagination.totalPages).map(
                (pageNum, idx) =>
                  pageNum === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className={`px-2 text-xs ${textMuted}`}
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${pageNum}`}
                      type="button"
                      onClick={() => {
                        updateShopUrl({ page: pageNum });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      aria-label={`Go to page ${pageNum}`}
                      aria-current={
                        currentPage === pageNum ? "page" : undefined
                      }
                      className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                        currentPage === pageNum
                          ? dark
                            ? "bg-[#7895C5] text-[#171E30] shadow-md shadow-[#7895C5]/20"
                            : "bg-[#202C50] text-white shadow-md shadow-[#202C50]/20"
                          : secondaryButton
                      }`}
                    >
                      {pageNum}
                    </button>
                  ),
              )}

              {/* Next */}
              <button
                type="button"
                onClick={() => {
                  updateShopUrl({ page: currentPage + 1 });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage >= pagination.totalPages}
                aria-label="Next page"
                className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${secondaryButton}`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </main>
  );
};

export default Shop;
