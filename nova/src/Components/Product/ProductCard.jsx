import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import {
  useAddWishlistProductMutation,
  useGetCurrentUserQuery,
  useGetWishlistQuery,
  useRemoveWishlistProductMutation,
} from "../../services/productsApi";
import { useState } from "react";
import { Heart } from "lucide-react";

function ProductCard({ product }) {
  const { formatPrice, navigate, dark } = UseGlob();
  const { data: user, isLoading: isCheckingUser } = useGetCurrentUserQuery();
  const { data: wishlist = [] } = useGetWishlistQuery(undefined, {
    skip: !user,
  });
  const [addWishlistProduct, { isLoading: isAdding }] =
    useAddWishlistProductMutation();
  const [removeWishlistProduct, { isLoading: isRemoving }] =
    useRemoveWishlistProductMutation();

  const [wishlistError, setWishlistError] = useState("");
  const image = product.productImage?.[0];
  const originalPrice = Number(product.price ?? 0);
  const sellingPrice = Number(product.sellingPrice ?? product.price ?? 0);
  const stock = Number(product.stock ?? 0);

  const discountPercent =
    originalPrice > sellingPrice && originalPrice > 0
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : 0;

  const isWishlisted = wishlist.some(
    (item) => item.productId?._id === product._id,
  );

  const handleWishlistClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setWishlistError("");
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      if (isWishlisted) {
        await removeWishlistProduct(product._id).unwrap();
      } else {
        await addWishlistProduct(product._id).unwrap();
      }
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate("/login");
        return;
      }
      setWishlistError(
        requestError.data?.message || "Could not update wishlist.",
      );
    }
  };

  return (
    <article
      className={`group relative flex h-full flex-col justify-between rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden ${
        dark
          ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:border-[#7895C5]/60 hover:bg-[#2D3B56]"
          : "border-[#D8E1EF] bg-white text-[#202C50] hover:border-[#344F82]/50 hover:bg-[#EDF2F9]"
      }`}
    >
      <Link to={`/product/${product._id}`} className="flex-1 flex flex-col">
        {/* Product Image Area */}
        <div
          className={`relative aspect-square w-full overflow-hidden rounded-t-2xl transition-colors ${
            dark ? "bg-[#171E30]" : "bg-[#F7F9FC]"
          }`}
        >
          {image ? (
            <img
              src={image}
              alt={product.productName}
              loading="lazy"
              className={`h-full w-full object-cover rounded-t-2xl transition-transform duration-500 ease-out group-hover:scale-105 ${
                stock === 0 ? "opacity-60 grayscale" : ""
              }`}
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center text-xs font-semibold ${
                dark ? "text-[#8190AA]" : "text-[#8A96AA]"
              }`}
            >
              No image
            </div>
          )}

          {/* Top-Left Category Badge (Responsive truncate) */}
          {product.category && (
            <span
              className={`absolute left-2 top-2 sm:left-3 sm:top-3 max-w-[55%] truncate rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-tight backdrop-blur-md shadow-2xs ${
                dark
                  ? "bg-[#202A40]/90 text-[#EAF0FA] border border-[#35435C]"
                  : "bg-white/90 text-[#202C50] border border-[#D8E1EF]"
              }`}
            >
              {product.category}
            </span>
          )}

          {/* Top-Right Floating Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            disabled={isCheckingUser || isAdding || isRemoving}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
            className={`absolute right-2 top-2 sm:right-3 sm:top-3 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 ${
              isWishlisted
                ? "border-[#C34D68]/40 bg-[#C34D68]/10 text-[#C34D68] dark:border-[#F08BA1]/40 dark:bg-[#F08BA1]/15 dark:text-[#F08BA1]"
                : dark
                ? "border-[#35435C] bg-[#202A40]/90 text-[#8190AA] hover:text-[#F08BA1] hover:border-[#F08BA1]/40"
                : "border-[#D8E1EF] bg-white/95 text-[#64718A] hover:text-[#C34D68] hover:border-[#C34D68]/40"
            }`}
          >
            <Heart
              size={15}
              className={
                isWishlisted
                  ? "fill-current"
                  : "transition-transform group-hover:scale-105"
              }
            />
          </button>

          {/* Out of Stock Overlay Banner */}
          {stock === 0 && (
            <div className="absolute inset-x-0 bottom-0 bg-[#C04452]/90 dark:bg-[#F08089]/90 py-1 text-center text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider backdrop-blur-xs">
              Out of stock
            </div>
          )}

          {/* Low Stock Pill Tag */}
          {stock > 0 && stock <= 5 && (
            <div className="absolute left-2 bottom-2 sm:left-3 sm:bottom-3 rounded-full bg-[#A66A22]/90 dark:bg-[#E6B66F]/90 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-white shadow-2xs">
              Only {stock} left
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex flex-1 flex-col justify-between gap-1 p-2.5 ">
          <div>
            {/* Brand Name */}
            <p
              className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate ${
                dark ? "text-[#8190AA]" : "text-[#8A96AA]"
              }`}
            >
              {product.brandName || "Brand"}
            </p>

            {/* Product Title (Consistent 2-line height for uniform cards) */}
            <h3
              className={`mt-1 text-xs sm:text-sm font-semibold line-clamp-2 h-8 sm:h-10 leading-snug transition-colors ${
                dark
                  ? "text-[#EAF0FA] group-hover:text-[#7895C5]"
                  : "text-[#202C50] group-hover:text-[#344F82]"
              }`}
              title={product.productName}
            >
              {product.productName}
            </h3>
          </div>

          {/* Price & Discount Row */}
          <div className=" border-t pt-2  border-dashed border-[#D8E1EF] dark:border-[#35435C]/60 flex items-center justify-between gap-1">
            <div className="flex items-baseline gap-[1px] flex-wrap">
              <span
                className={`text-sm sm:text-base font-extrabold tracking-tight ${
                  dark ? "text-[#7895C5]" : "text-[#202C50]"
                }`}
              >
                {formatPrice.format(sellingPrice)}
              </span>

              {originalPrice > sellingPrice && (
                <span
                  className={`text-[10px] sm:text-xs line-through ${
                    dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                  }`}
                >
                  {formatPrice.format(originalPrice)}
                </span>
              )}
            </div>

            {/* Discount Percentage Pill */}
            {discountPercent > 0 && (
              <span className="rounded-md text-nowrap bg-[#B74747]/10 border border-[#B74747]/30 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-black text-[#B74747] dark:bg-[#F08080]/15 dark:border-[#F08080]/30 dark:text-[#F08080]">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>
      </Link>

      {wishlistError && (
        <p className="px-3 pb-2 text-[10px] text-[#C04452] dark:text-[#F08089]">{wishlistError}</p>
      )}
    </article>
  );
}

export default ProductCard;