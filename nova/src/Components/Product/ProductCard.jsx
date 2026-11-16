
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

  const { data: user, isLoading: isCheckingUser } =
    useGetCurrentUserQuery();

  const { data: rawWishlist = [] } = useGetWishlistQuery(undefined, {
    skip: !user,
  });

  const wishlist = user && Array.isArray(rawWishlist) ? rawWishlist : [];

  const [addWishlistProduct, { isLoading: isAdding }] =
    useAddWishlistProductMutation();

  const [removeWishlistProduct, { isLoading: isRemoving }] =
    useRemoveWishlistProductMutation();

  const [wishlistError, setWishlistError] = useState("");

  const image = product.productImage?.[0];
  const originalPrice = Number(product.price ?? 0);
  const sellingPrice = Number(
    product.sellingPrice ?? product.price ?? 0
  );
  const stock = Number(product.stock ?? 0);

  const discountPercent =
    originalPrice > sellingPrice && originalPrice > 0
      ? Math.round(
          ((originalPrice - sellingPrice) / originalPrice) * 100
        )
      : 0;

  const isWishlisted = wishlist.some(
    (item) => item.productId?._id === product._id
  );

  // Theme colors
  const cardStyle = dark
    ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:border-[#7895C5]/60 hover:bg-[#2D3B56]"
    : "border-[#D8E1EF] bg-white text-[#202C50] hover:border-[#344F82]/50 hover:bg-[#F7F9FC]";

  const imageBackground = dark ? "bg-[#171E30]" : "bg-[#F7F9FC]";

  const mutedText = dark ? "text-[#8190AA]" : "text-[#8A96AA]";

  const titleColor = dark
    ? "text-[#EAF0FA] group-hover:text-[#7895C5]"
    : "text-[#202C50] group-hover:text-[#344F82]";

  const priceColor = dark ? "text-[#7895C5]" : "text-[#344F82]";

  const dividerColor = dark
    ? "border-[#35435C]"
    : "border-[#D8E1EF]";

  const wishlistButton = isWishlisted
    ? dark
      ? "border-[#F08089]/40 bg-[#F08089]/20 text-[#F08089] backdrop-blur-md"
      : "border-[#C04452]/40 bg-[#C04452]/15 text-[#C04452] backdrop-blur-md"
    : dark
      ? "border-[#35435C] bg-[#171E30]/85 text-[#8190AA] hover:text-[#F08089] hover:border-[#F08089]/40 backdrop-blur-md"
      : "border-[#D8E1EF] bg-white/90 text-[#64718A] hover:text-[#C04452] hover:border-[#C04452]/40 backdrop-blur-md";

  const discountBadge = dark
    ? "border-[#F08080]/40 bg-[#171E30]/90 text-[#F08080] shadow-sm backdrop-blur-md"
    : "border-[#B74747]/30 bg-white/95 text-[#B74747] shadow-sm backdrop-blur-md";

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
        requestError.data?.message || "Could not update wishlist."
      );
    }
  };

  return (
    <article
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cardStyle}`}
    >
      <Link
        to={`/product/${product._id}`}
        className="flex flex-1 flex-col"
      >
        {/* Product Image Area */}
        <div
          className={`relative aspect-square w-full overflow-hidden rounded-t-2xl transition-colors ${imageBackground}`}
        >
          {image ? (
            <img
              src={image}
              alt={product.productName}
              loading="lazy"
              className={`h-full w-full rounded-t-2xl object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
                stock === 0 ? "opacity-60 grayscale" : ""
              }`}
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center text-xs font-semibold ${mutedText}`}
            >
              No image
            </div>
          )}

          {/* Category Badge */}
          {product.category && (
            <span
              className={`absolute left-2 top-2 max-w-[55%] truncate rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-tight shadow-sm backdrop-blur-md sm:left-3 sm:top-3 sm:text-[11px] ${
                dark
                  ? "border-[#35435C] bg-[#202A40]/90 text-[#EAF0FA]"
                  : "border-[#D8E1EF] bg-white/90 text-[#202C50]"
              }`}
            >
              {product.category}
            </span>
          )}

          {/* Discount Badge (Top Right) */}
          {discountPercent > 0 && (
            <span
              className={`absolute left-2 bottom-2 z-10 rounded-full border px-2 py-0.5 text-[10px] font-black tracking-tight sm:right-3 sm:top-3 sm:text-[11px] ${discountBadge}`}
            >
              {discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Button (Bottom Right) */}
          <button
            type="button"
            onClick={handleWishlistClick}
            disabled={isCheckingUser || isAdding || isRemoving}
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            aria-pressed={isWishlisted}
            className={`absolute bottom-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 sm:bottom-3 sm:right-3 sm:h-8 sm:w-8 ${wishlistButton}`}
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

          {/* Out of Stock Banner */}
          {stock === 0 && (
            <div
              className={`absolute inset-x-0 bottom-0 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:text-xs ${
                dark ? "bg-[#F08089]/90" : "bg-[#C04452]/90"
              }`}
            >
              Out of stock
            </div>
          )}

          {/* Low Stock Badge */}
          {stock > 0 && stock <= 5 && (
            <div
              className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-black shadow-sm sm:bottom-3 sm:left-3 sm:text-[10px] ${
                dark
                  ? "bg-[#E6B66F] text-[#171E30]"
                  : "bg-[#A66A22] text-white"
              }`}
            >
              Only {stock} left
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between gap-1 p-2.5">
          <div>
            {/* Brand Name */}
            <p
              className={`truncate text-[10px] font-bold uppercase tracking-wider sm:text-[11px] ${mutedText}`}
            >
              {product.brandName || "Brand"}
            </p>

            {/* Product Title */}
            <h3
              className={`mt-1 h-8 text-xs font-semibold leading-snug line-clamp-2 transition-colors sm:h-10 sm:text-sm ${titleColor}`}
              title={product.productName}
            >
              {product.productName}
            </h3>
          </div>

          {/* Price */}
          <div
            className={`flex flex-wrap items-baseline gap-1.5 border-t border-dashed pt-2 ${dividerColor}`}
          >
            <span
              className={`text-sm font-extrabold tracking-tight sm:text-base ${priceColor}`}
            >
              {formatPrice.format(sellingPrice)}
            </span>

            {originalPrice > sellingPrice && (
              <span
                className={`text-[10px] line-through sm:text-xs ${mutedText}`}
              >
                {formatPrice.format(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist Error */}
      {wishlistError && (
        <p
          className={`px-3 pb-2 text-[10px] ${
            dark ? "text-[#F08089]" : "text-[#C04452]"
          }`}
        >
          {wishlistError}
        </p>
      )}
    </article>
  );
}

export default ProductCard;
