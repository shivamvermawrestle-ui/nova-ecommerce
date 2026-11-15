
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
    (product) => Number(product.stock ?? 0) > 0
  );

  const featuredIds = new Set(
    products
      .filter((product) => product.isFeatured)
      .map((product) => String(product._id))
  );

  const recommendedProducts = inStockProducts
    .filter((product) => !featuredIds.has(String(product._id)))
    .slice(0, 8);

  // Theme colors
  const mainText = dark ? "text-[#EAF0FA]" : "text-[#202C50]";
  const mutedText = dark ? "text-[#AAB8D0]" : "text-[#64718A]";
  const accentText = dark ? "text-[#7895C5]" : "text-[#344F82]";

  const primaryButton = dark
    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
    : "bg-[#202C50] text-white hover:bg-[#344F82]";

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Section Header */}
      <div className="mb-6 flex justify-between gap-4  ">
        <div>
          {/* Section Badge */}
          <div
            className={`mb-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${
              dark
                ? "border-[#7895C5]/30 bg-[#202A40] text-[#7895C5]"
                : "border-[#344F82]/20 bg-[#DFE7F3] text-[#344F82]"
            }`}
          >
            <Sparkles size={13} className={accentText} />
            <span>More To Explore</span>
          </div>

          {/* Heading */}
          <h2
            className={`text-2xl font-extrabold tracking-tight  text-nowrap transition-colors sm:text-3xl ${mainText}`}
          >
            Recommended 
          </h2>

          {/* Description */}
          <p
            className={`mt-1 text-xs transition-colors sm:text-sm ${mutedText}`}
          >
            Curated picks based on what customers are shopping right now
          </p>
        </div>

        {/* View All Button */}
        <Link
          to="/shop"
          className={`inline-flex items-center gap-1.5 text-nowrap  rounded-xl  text-xs font-bold  transition-all ${
            dark
              ? " text-[#EAF0FA] hover:underline  underline-offset-1  underline-[#344f82] "
              : " text-[#344F82]  hover:underline  underline-offset-1  underline-[#3eaf0fa]"
          }`}
        >
          <span>View all</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        /* Error State */
        <div
          className={`rounded-2xl border p-8 text-center transition-colors ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
              : "border-[#D8E1EF] bg-white text-[#202C50]"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              dark ? "text-[#F08089]" : "text-[#C04452]"
            }`}
          >
            Could not load recommendations.
          </p>

          <button
            type="button"
            onClick={refetch}
            className={`mt-3 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-all active:scale-95 ${primaryButton}`}
          >
            <RefreshCw size={14} />
            <span>Try again</span>
          </button>
        </div>
      ) : recommendedProducts.length === 0 ? (
        /* Empty State */
        <div
          className={`rounded-2xl border p-12 text-center transition-colors ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#AAB8D0]"
              : "border-[#D8E1EF] bg-white text-[#64718A]"
          }`}
        >
          No in-stock recommendations available right now.
        </div>
      ) : (
        /* Recommended Products */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedProducts;
