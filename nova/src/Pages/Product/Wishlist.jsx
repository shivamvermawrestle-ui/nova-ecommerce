import { Link } from "react-router-dom";
import { useGetWishlistQuery } from "../../services/productsApi";
import ProductCard from "../../Components/Product/ProductCard";
import ProductCardSkeleton from "../../Components/Product/ProductCardSkeleton";
import { UseGlob } from "../../Context/GlobalContext";
import usePageTitle from "../../hooks/usePageTitle";
import {
  Heart,
  ArrowRight,
  ShoppingBag,
  LogIn,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const Wishlist = () => {
  const { dark } = UseGlob();

  const {
    data: wishlist = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetWishlistQuery();

  usePageTitle(
    "My Wishlist",
    "View and manage your saved favourite products on Nova.",
  );

  const products = wishlist.map((item) => item.productId).filter(Boolean);

  // Theme colors
  const pageBg = dark ? "bg-[#171E30]" : "bg-[#F7F9FC]";
  const cardBg = dark ? "bg-[#202A40]" : "bg-white";
  const borderColor = dark ? "border-[#35435C]" : "border-[#D8E1EF]";

  const textPrimary = dark ? "text-[#EAF0FA]" : "text-[#202C50]";
  const textSecondary = dark ? "text-[#AAB8D0]" : "text-[#64718A]";

  const primaryButton = dark
    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
    : "bg-[#202C50] text-white hover:bg-[#344F82]";

  const secondaryButton = dark
    ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
    : "border-[#D8E1EF] bg-white text-[#202C50] hover:bg-[#EDF2F9]";

  // Loading State
  if (isLoading) {
    return (
      <main className={`min-h-screen ${pageBg} transition-colors duration-300`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 animate-pulse">
          <div
            className={`h-4 w-32 rounded mb-4 ${
              dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
            }`}
          />

          <div
            className={`h-8 w-60 rounded mb-8 ${
              dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
            }`}
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: 4 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error State
  if (isError) {
    return (
      <main
        className={`min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 ${pageBg}`}
      >
        <div
          className={`w-full max-w-md rounded-3xl border p-7 sm:p-10 text-center shadow-xl transition-colors ${cardBg} ${borderColor}`}
        >
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-2xl border mx-auto mb-5 ${
              dark
                ? "bg-[#E6B66F]/10 border-[#E6B66F]/20 text-[#E6B66F]"
                : "bg-[#A66A22]/10 border-[#A66A22]/20 text-[#A66A22]"
            }`}
          >
            {error?.status === 401 ? (
              <LogIn className="w-8 h-8" />
            ) : (
              <AlertCircle className="w-8 h-8" />
            )}
          </div>

          <h1 className={`text-xl sm:text-2xl font-extrabold ${textPrimary}`}>
            {error?.status === 401
              ? "Sign In to View Wishlist"
              : "Could Not Load Wishlist"}
          </h1>

          <p
            className={`mt-2 text-xs sm:text-sm leading-relaxed ${textSecondary}`}
          >
            {error?.status === 401
              ? "Log in to your account to access your saved favourites across all your devices."
              : error?.data?.message ||
                "There was a problem loading your saved products."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            {error?.status === 401 ? (
              <Link
                to="/login"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${primaryButton}`}
              >
                <LogIn className="w-4 h-4" />
                Log In Now
              </Link>
            ) : (
              <button
                type="button"
                onClick={refetch}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${primaryButton}`}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}

            <Link
              to="/shop"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all ${secondaryButton}`}
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-7 sm:py-10 lg:py-12 flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <section
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b ${borderColor}`}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  dark ? "text-[#F08BA1]" : "text-[#C34D68]"
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                Saved For Later
              </span>

              <span
                className={`w-1 h-1 rounded-full ${
                  dark ? "bg-[#465570]" : "bg-[#D8E1EF]"
                }`}
              />

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  dark
                    ? "bg-[#202A40] text-[#EAF0FA] border-[#35435C]"
                    : "bg-white text-[#202C50] border-[#D8E1EF]"
                }`}
              >
                {products.length} {products.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            <h1
              className={`mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${textPrimary}`}
            >
              My Wishlist
            </h1>

            <p
              className={`mt-2 text-xs sm:text-sm max-w-xl leading-relaxed ${textSecondary}`}
            >
              Items you've bookmarked for later. Add them to your cart or share
              with friends whenever you're ready.
            </p>
          </div>
        </section>

        {/* Empty Wishlist */}
        {products.length === 0 ? (
          <section
            className={`my-6 sm:my-12 rounded-3xl border p-8 sm:p-12 lg:p-14 text-center max-w-lg mx-auto w-full shadow-sm transition-colors ${cardBg} ${borderColor}`}
          >
            <div className="relative mx-auto flex items-center justify-center w-20 h-20 mb-6">
              <div
                className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                  dark ? "bg-[#F08BA1]" : "bg-[#C34D68]"
                }`}
              />

              <div
                className={`relative flex items-center justify-center w-20 h-20 rounded-full border ${
                  dark
                    ? "bg-[#F08BA1]/10 border-[#F08BA1]/20 text-[#F08BA1] ring-8 ring-[#F08BA1]/5"
                    : "bg-[#C34D68]/10 border-[#C34D68]/20 text-[#C34D68] ring-8 ring-[#C34D68]/5"
                }`}
              >
                <Heart className="w-10 h-10 stroke-[2.2]" />
              </div>
            </div>

            <h2
              className={`text-xl sm:text-2xl font-extrabold tracking-tight ${textPrimary}`}
            >
              Your Wishlist is Empty
            </h2>

            <p
              className={`mt-2.5 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed ${textSecondary}`}
            >
              You haven't saved any items yet. Browse our store and tap the
              heart icon on any product to save it here for later!
            </p>

            <Link
              to="/shop"
              className={`mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${primaryButton}`}
            >
              <ShoppingBag className="w-4 h-4" />
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        ) : (
          <>
            {/* Products Grid */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </section>

            {/* Continue Shopping */}
            <div className="flex justify-center pt-4">
              <Link
                to="/shop"
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm border transition-all duration-200 shadow-sm ${secondaryButton}`}
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
