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
      : "Browse the entire Nova product collection."
  );

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

  // Clear a specific filter
  const removeFilter = (filterKey) => {
    updateShopUrl({ [filterKey]: "", page: 1 });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Full page Error State
  if (isError && !productsResponse) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-full border ${
            dark
              ? "bg-[#C04452]/10 border-[#C04452]/20 text-[#F08089]"
              : "bg-red-50 border-red-200 text-[#C04452]"
          }`}
        >
          <RefreshCw className="w-8 h-8" />
        </div>
        <h1
          className={`text-2xl font-bold ${
            dark ? "text-[#EAF0FA]" : "text-[#202C50]"
          }`}
        >
          Unable to Load Products
        </h1>
        <p
          className={`text-sm max-w-md ${
            dark ? "text-[#AAB8D0]" : "text-[#64718A]"
          }`}
        >
          {error?.data?.message ||
            error?.error ||
            "There may be a network issue. Please try again."}
        </p>
        <button
          type="button"
          onClick={refetch}
          className={`mt-4 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            dark
              ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
              : "bg-[#202C50] text-white hover:bg-[#344F82]"
          }`}
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        dark ? "bg-[#171E30]" : "bg-[#F7F9FC]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D8E1EF] dark:border-[#35435C]">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  dark ? "text-[#7895C5]" : "text-[#202C50]"
                }`}
              >
                Curated Selection
              </span>
              <span
                className={`w-1 h-1 rounded-full ${
                  dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                }`}
              >
                {pagination?.totalProducts ?? products.length} items available
              </span>
            </div>

            <h1
              className={`mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight capitalize ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              {searchTerm
                ? `Results for "${searchTerm}"`
                : activeCategory
                ? `${activeCategory} Collection`
                : "Explore All Products"}
            </h1>

            <p
              className={`mt-1.5 text-xs sm:text-sm max-w-xl ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Browse our highest quality products, handpicked with guaranteed
              satisfaction and fast delivery.
            </p>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-3 self-start md:self-end shrink-0">
            <div
              className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2 shadow-sm transition-colors ${
                dark
                  ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
                  : "border-[#D8E1EF] bg-white text-[#202C50]"
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5 opacity-70 shrink-0" />
              <label
                htmlFor="sort-select"
                className={`text-xs font-semibold shrink-0 ${
                  dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                }`}
              >
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) =>
                  updateShopUrl({ sort: e.target.value, page: 1 })
                }
                className="bg-transparent outline-none cursor-pointer text-xs sm:text-sm font-semibold pr-1"
              >
                <option
                  value="newest"
                  className={
                    dark
                      ? "bg-[#202A40] text-[#EAF0FA]"
                      : "bg-white text-[#202C50]"
                  }
                >
                  Newest Arrivals
                </option>
                <option
                  value="price-low"
                  className={
                    dark
                      ? "bg-[#202A40] text-[#EAF0FA]"
                      : "bg-white text-[#202C50]"
                  }
                >
                  Price: Low to High
                </option>
                <option
                  value="price-high"
                  className={
                    dark
                      ? "bg-[#202A40] text-[#EAF0FA]"
                      : "bg-white text-[#202C50]"
                  }
                >
                  Price: High to Low
                </option>
                <option
                  value="name-asc"
                  className={
                    dark
                      ? "bg-[#202A40] text-[#EAF0FA]"
                      : "bg-white text-[#202C50]"
                  }
                >
                  Name: A to Z
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(activeCategory || searchTerm) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold flex items-center gap-1 ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </span>

            {activeCategory && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border capitalize transition-colors ${
                  dark
                    ? "bg-[#202A40] border-[#35435C] text-[#EAF0FA]"
                    : "bg-white border-[#D8E1EF] text-[#202C50]"
                }`}
              >
                <span>Category: {activeCategory}</span>
                <button
                  type="button"
                  onClick={() => removeFilter("category")}
                  aria-label="Remove category filter"
                  className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchTerm && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                  dark
                    ? "bg-[#202A40] border-[#35435C] text-[#EAF0FA]"
                    : "bg-white border-[#D8E1EF] text-[#202C50]"
                }`}
              >
                <span>Search: "{searchTerm}"</span>
                <button
                  type="button"
                  onClick={() => removeFilter("q")}
                  aria-label="Remove search filter"
                  className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className={`text-xs font-bold underline transition-colors ml-1 ${
                dark
                  ? "text-[#7895C5] hover:text-[#9BB2D8]"
                  : "text-[#202C50] hover:text-[#344F82]"
              }`}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Product Grid / Loading / Empty States */}
        {isLoading && !productsResponse ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div
            className={`my-8 sm:my-14 rounded-3xl border p-8 sm:p-14 text-center max-w-lg mx-auto transition-colors shadow-sm ${
              dark
                ? "bg-[#202A40] border-[#35435C]"
                : "bg-white border-[#D8E1EF]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${
                dark
                  ? "bg-[#171E30] border-[#35435C] text-[#7895C5]"
                  : "bg-[#F7F9FC] border-[#D8E1EF] text-[#202C50]"
              }`}
            >
              <PackageSearch className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h2
              className={`text-lg sm:text-xl font-bold tracking-tight ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              No Products Found
            </h2>
            <p
              className={`mt-2 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              {searchTerm
                ? `We couldn't find any products matching "${searchTerm}". Try checking your spelling or using different keywords.`
                : "No products match the selected criteria."}
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className={`mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                dark
                  ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                  : "bg-[#202C50] text-white hover:bg-[#344F82]"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Subtle fetching indicator overlay when navigating pages */}
            {isFetching && (
              <div className="absolute inset-0 bg-white/40 dark:bg-black/30 backdrop-blur-[1px] z-10 rounded-2xl pointer-events-none transition-opacity" />
            )}

            <section className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </section>
          </div>
        )}

        {/* Modern Pagination Section */}
        {pagination?.totalPages > 1 && (
          <nav
            aria-label="Product pages"
            className={`mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6 transition-colors ${
              dark ? "border-[#35435C]" : "border-[#D8E1EF]"
            }`}
          >
            <p
              className={`text-xs sm:text-sm ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Showing{" "}
              <span
                className={`font-semibold ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {Math.min(
                  (currentPage - 1) * PAGE_SIZE + 1,
                  pagination.totalProducts
                )}
              </span>{" "}
              to{" "}
              <span
                className={`font-semibold ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {Math.min(currentPage * PAGE_SIZE, pagination.totalProducts)}
              </span>{" "}
              of{" "}
              <span
                className={`font-semibold ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {pagination.totalProducts}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => {
                  updateShopUrl({ page: currentPage - 1 });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs sm:text-sm font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
                  dark
                    ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
                    : "border-[#D8E1EF] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              {generatePaginationPages(
                currentPage,
                pagination.totalPages
              ).map((pageNum, idx) =>
                pageNum === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className={`px-2 text-xs ${
                      dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                    }`}
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
                    className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                      currentPage === pageNum
                        ? dark
                          ? "bg-[#7895C5] text-[#171E30] shadow-md shadow-[#7895C5]/20"
                          : "bg-[#202C50] text-white shadow-md shadow-[#202C50]/20"
                        : dark
                        ? "border border-[#35435C] bg-[#202A40] text-[#AAB8D0] hover:text-[#EAF0FA] hover:border-[#7895C5]"
                        : "border border-[#D8E1EF] bg-white text-[#64718A] hover:text-[#202C50] hover:border-[#344F82]"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => {
                  updateShopUrl({ page: currentPage + 1 });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage >= pagination.totalPages}
                aria-label="Next page"
                className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs sm:text-sm font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
                  dark
                    ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
                    : "border-[#D8E1EF] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
                }`}
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
