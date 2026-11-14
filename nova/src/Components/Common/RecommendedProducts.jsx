import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../../services/productsApi";
import ProductCard from "../Product/ProductCard";
import ProductCardSkeleton from "../Product/ProductCardSkeleton";
import { UseGlob } from "../../Context/GlobalContext";
import { ArrowRight, Sparkles, RefreshCw } from "lucide-react";

const RecommendedProducts = () => {
  const { dark } = UseGlob();
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery();

  const inStockProducts = products.filter(
    (product) => Number(product.stock ?? 0) > 0,
  );

  const featuredIds = new Set(
    products
      .filter((product) => product.isFeatured)
      .map((product) => String(product._id)),
  );

  const recommendedProducts = inStockProducts
    .filter((product) => !featuredIds.has(String(product._id)))
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Modern Section Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-2 transition-colors ${
              dark
                ? "bg-[#202A40] text-[#7895C5] border border-[#7895C5]/30"
                : "bg-[#DFE7F3] text-[#202C50] border border-[#202C50]/20"
            }`}
          >
            <Sparkles size={13} className="text-[#3568A8] dark:text-[#8CB4EC]" />
            <span>More To Explore</span>
          </div>

          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors ${
              dark ? "text-[#EAF0FA]" : "text-[#202C50]"
            }`}
          >
            Recommended Products
          </h2>
          <p
            className={`text-xs sm:text-sm mt-1 transition-colors ${
              dark ? "text-[#AAB8D0]" : "text-[#64718A]"
            }`}
          >
            Curated picks based on what customers are shopping right now
          </p>
        </div>

        <Link
          to="/shop"
          className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition-all shadow-2xs active:scale-95 ${
            dark
              ? "border-[#465570] bg-[#202A40] text-[#DCE5F4] hover:border-[#7895C5] hover:bg-[#2D3B56]"
              : "border-[#C9D5E7] bg-white text-[#344F82] hover:border-[#202C50] hover:bg-[#EDF2F9]"
          }`}
        >
          <span>View all products</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: 4 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div
          className={`rounded-2xl border p-8 text-center transition-colors ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
              : "border-[#D8E1EF] bg-[#FFFFFF] text-[#202C50]"
          }`}
        >
          <p className="text-sm text-[#C04452] dark:text-[#F08089] font-medium">
            Could not load recommendations.
          </p>
          <button
            type="button"
            onClick={refetch}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#202C50] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#344F82] dark:bg-[#7895C5] dark:text-[#171E30] dark:hover:bg-[#9BB2D8] transition-all"
          >
            <RefreshCw size={14} />
            <span>Try again</span>
          </button>
        </div>
      ) : recommendedProducts.length === 0 ? (
        <div
          className={`rounded-2xl border p-12 text-center transition-colors ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#AAB8D0]"
              : "border-[#D8E1EF] bg-[#FFFFFF] text-[#64718A]"
          }`}
        >
          No in-stock recommendations available right now.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedProducts;
