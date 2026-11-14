import { Link } from "react-router-dom";
import { useGetWishlistQuery } from "../../services/productsApi";
import ProductCard from "../../Components/Product/ProductCard";
import ProductCardSkeleton from "../../Components/Product/ProductCardSkeleton";
import { UseGlob } from "../../Context/GlobalContext";
import usePageTitle from "../../hooks/usePageTitle";
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  LogIn,
  AlertCircle,
  Sparkles,
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
    "View and manage your saved favourite products on Nova."
  );

  const products = wishlist.map((item) => item.productId).filter(Boolean);

  // Skeleton Loading State
  if (isLoading) {
    return (
      <main
        className={`min-h-screen transition-colors duration-300 ${
          dark ? "bg-[#171E30]" : "bg-[#F7F9FC]"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 animate-pulse">
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-[#202A40] mb-4" />
          <div className="h-8 w-60 rounded bg-gray-200 dark:bg-[#202A40] mb-8" />
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {Array.from({ length: 4 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error State (e.g. 401 Unauthorized or network error)
  if (isError) {
    return (
      <main
        className={`min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 transition-colors duration-300 ${
          dark ? "bg-[#171E30]" : "bg-[#F7F9FC]"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-3xl border p-8 sm:p-10 text-center transition-all duration-300 shadow-xl ${
            dark
              ? "border-[#35435C] bg-[#202A40] shadow-black/40 text-[#EAF0FA]"
              : "border-[#D8E1EF] bg-white shadow-[#202C50]/5 text-[#202C50]"
          }`}
        >
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-full border mx-auto mb-5 ${
              dark
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                : "bg-amber-50 border-amber-200 text-amber-600"
            }`}
          >
            {error?.status === 401 ? (
              <LogIn className="w-8 h-8" />
            ) : (
              <AlertCircle className="w-8 h-8" />
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {error?.status === 401
              ? "Sign In to View Wishlist"
              : "Could Not Load Wishlist"}
          </h1>

          <p
            className={`mt-2 text-xs sm:text-sm leading-relaxed ${
              dark ? "text-[#AAB8D0]" : "text-[#64718A]"
            }`}
          >
            {error?.status === 401
              ? "Log in to your account to access your saved favourites across all your devices."
              : error?.data?.message || "There was a problem loading your saved products."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            {error?.status === 401 ? (
              <Link
                to="/login"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  dark
                    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                    : "bg-[#202C50] text-white hover:bg-[#344F82]"
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Log In Now</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={refetch}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  dark
                    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                    : "bg-[#202C50] text-white hover:bg-[#344F82]"
                }`}
              >
                <span>Try Again</span>
              </button>
            )}

            <Link
              to="/shop"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all ${
                dark
                  ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA] hover:bg-[#2D3B56]"
                  : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50] hover:bg-[#EDF2F9]"
              }`}
            >
              Browse Shop
            </Link>
          </div>
        </div>
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#D8E1EF] dark:border-[#35435C]">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                  dark ? "text-[#7895C5]" : "text-[#202C50]"
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Saved For Later</span>
              </span>
              <span
                className={`w-1 h-1 rounded-full ${
                  dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
                }`}
              />
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  dark
                    ? "bg-[#202A40] text-[#7895C5] border border-[#35435C]"
                    : "bg-white text-[#202C50] border border-[#D8E1EF]"
                }`}
              >
                {products.length} {products.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            <h1
              className={`mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              My Wishlist
            </h1>

            <p
              className={`mt-1.5 text-xs sm:text-sm max-w-xl ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Items you've bookmarked for later. Add them to your cart or share
              with friends whenever you're ready.
            </p>
          </div>

        </div>

        {/* Empty Wishlist State */}
        {products.length === 0 ? (
          <div
            className={`my-6 sm:my-12 rounded-3xl border p-8 sm:p-14 text-center max-w-lg mx-auto transition-colors shadow-sm ${
              dark
                ? "bg-[#202A40] border-[#35435C]"
                : "bg-white border-[#D8E1EF]"
            }`}
          >
            {/* Animated Heart Icon */}
            <div className="relative mx-auto flex items-center justify-center w-20 h-20 mb-6">
              <div
                className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                  dark ? "bg-[#F08BA1]" : "bg-[#C34D68]"
                }`}
              />
              <div
                className={`relative flex items-center justify-center w-20 h-20 rounded-full border transition-all ${
                  dark
                    ? "bg-[#F08BA1]/10 border-[#F08BA1]/20 text-[#F08BA1] ring-8 ring-[#F08BA1]/5"
                    : "bg-[#C34D68]/10 border-[#C34D68]/20 text-[#C34D68] ring-8 ring-[#C34D68]/5"
                }`}
              >
                <Heart className="w-10 h-10 stroke-[2.2]" />
              </div>
            </div>

            <h2
              className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              Your Wishlist is Empty
            </h2>

            <p
              className={`mt-2.5 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              You haven't saved any items yet. Browse our store and tap the heart
              icon on any product to save it here for later!
            </p>

            <Link
              to="/shop"
              className={`mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                dark
                  ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8] shadow-[#7895C5]/15"
                  : "bg-[#202C50] text-white hover:bg-[#344F82] shadow-[#202C50]/20"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <section className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </section>
        )}
      </div>
      
      <div className="flex justify-center ">

          {products.length > 0 && (
            <Link
              to="/shop"
              className={`self-start sm:self-end inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all duration-200 shadow-sm ${
                dark
                  ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
                  : "border-[#D8E1EF] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          )}
      </div>
    </main>
  );
};

export default Wishlist;
