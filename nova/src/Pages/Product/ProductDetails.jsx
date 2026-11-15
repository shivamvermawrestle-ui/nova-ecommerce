
import { Link, useParams } from "react-router-dom";
import {
  useAddToCartMutation,
  useAddWishlistProductMutation,
  useCreatePaymentSessionMutation,
  useGetCurrentUserQuery,
  useGetProductDetailsQuery,
  useGetProductReviewsQuery,
  useGetWishlistQuery,
  useRemoveWishlistProductMutation,
  useSubmitProductReviewMutation,
} from "../../services/productsApi";
import { UseGlob } from "../../Context/GlobalContext";
import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Check,
  ArrowLeft,
  Lock,
  ChevronRight,
  Share2,
  AlertCircle,
  Package,
} from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";

const ProductDetails = () => {
  const { navigate, dark, formatPrice } = UseGlob();
  const { id } = useParams();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductDetailsQuery(id);

  usePageTitle(
    product?.productName || "Product Details",
    product?.description || "Explore this premium product on our store."
  );

  const [
    addToCart,
    { isLoading: isAdding, isSuccess: added, error: addError },
  ] = useAddToCartMutation();

  const [createPaymentSession, { isLoading: isStartingCheckout }] =
    useCreatePaymentSessionMutation();

  const [buyNowError, setBuyNowError] = useState("");

  const { data: user, isLoading: isCheckingUser } = useGetCurrentUserQuery();

  const { data: wishlist = [] } = useGetWishlistQuery(undefined, {
    skip: !user,
  });

  const [addWishlistProduct, { isLoading: isAddingWishlist }] =
    useAddWishlistProductMutation();

  const [removeWishlistProduct, { isLoading: isRemovingWishlist }] =
    useRemoveWishlistProductMutation();

  const [wishlistError, setWishlistError] = useState("");

  const {
    data: reviewSummary,
    isLoading: isLoadingReviews,
    isError: isReviewsError,
    error: reviewsError,
  } = useGetProductReviewsQuery(id);

  const [submitProductReview, { isLoading: isSubmittingReview }] =
    useSubmitProductReviewMutation();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Theme colors
  const pageBg = dark ? "bg-[#171E30]" : "bg-[#F7F9FC]";
  const cardBg = dark ? "bg-[#202A40]" : "bg-white";
  const softBg = dark ? "bg-[#171E30]/60" : "bg-[#F7F9FC]";
  const borderColor = dark ? "border-[#35435C]" : "border-[#D8E1EF]";

  const textPrimary = dark ? "text-[#EAF0FA]" : "text-[#202C50]";
  const textSecondary = dark ? "text-[#AAB8D0]" : "text-[#64718A]";
  const textMuted = dark ? "text-[#8190AA]" : "text-[#8A96AA]";
  const accentText = dark ? "text-[#7895C5]" : "text-[#344F82]";

  const primaryButton = dark
    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
    : "bg-[#202C50] text-white hover:bg-[#344F82]";

  const secondaryButton = dark
    ? "bg-[#202A40] border-[#35435C] text-[#EAF0FA] hover:bg-[#2D3B56]"
    : "bg-white border-[#D8E1EF] text-[#202C50] hover:bg-[#EDF2F9]";

  const inputStyle = dark
    ? "bg-[#202A40] border-[#465570] text-[#EAF0FA] placeholder-[#8190AA] focus:border-[#7895C5]"
    : "bg-white border-[#D8E1EF] text-[#202C50] placeholder-[#8A96AA] focus:border-[#344F82]";

  const errorText = dark ? "text-[#F08089]" : "text-[#C04452]";

  const successText = dark ? "text-[#65C995]" : "text-[#27845B]";

  const warningText = dark ? "text-[#E6B66F]" : "text-[#A66A22]";

  const successBg = dark
    ? "bg-[#65C995]/10 border-[#65C995]/20"
    : "bg-[#27845B]/10 border-[#27845B]/20";

  const warningBg = dark
    ? "bg-[#E6B66F]/10 border-[#E6B66F]/20"
    : "bg-[#A66A22]/10 border-[#A66A22]/20";

  const errorBg = dark
    ? "bg-[#F08089]/10 border-[#F08089]/20"
    : "bg-[#C04452]/10 border-[#C04452]/20";

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage("");

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await submitProductReview({
        productId: product._id,
        rating,
        comment,
      }).unwrap();

      setRating(5);
      setComment("");
      setReviewMessage("Thank you! Your review was successfully submitted.");
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate("/login");
        return;
      }

      setReviewMessage(
        requestError.data?.message || "Could not submit your review."
      );
    }
  };

  // Wishlist
  const isWishlisted =
    Boolean(product?._id) &&
    wishlist.some((item) => item.productId?._id === product._id);

  const handleWishlistClick = async () => {
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

  // Product images
  const images = Array.isArray(product?.productImage)
    ? product.productImage.filter(Boolean)
    : product?.productImage
    ? [product.productImage]
    : [];

  const activeImage = images[selectedImageIndex] || images[0];

  // Pricing
  const originalPrice = Number(product?.price ?? 0);
  const sellingPrice = Number(product?.sellingPrice ?? product?.price ?? 0);

  const discountPercent =
    originalPrice > sellingPrice && originalPrice > 0
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : 0;

  // Stock
  const stock = Number(product?.stock ?? 0);
  const isOutOfStock = stock < 1;

  // Add to cart
  const handleAddToCart = async () => {
    try {
      await addToCart(product._id).unwrap();
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate("/login");
      }
    }
  };

  // Buy now
  const handleBuyNow = async () => {
    setBuyNowError("");

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const result = await createPaymentSession({
        productId: product._id,
        quantity: 1,
      }).unwrap();

      if (!result?.data?.url) {
        throw new Error("Stripe did not return a checkout URL.");
      }

      window.location.assign(result.data.url);
    } catch (requestError) {
      if (requestError?.status === 401) {
        navigate("/login");
        return;
      }

      setBuyNowError(
        requestError?.data?.message ||
          requestError?.message ||
          "Could not start checkout."
      );
    }
  };

  // Share product
  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Skeleton Loader
  if (isLoading) {
    return (
      <main className={`min-h-screen ${pageBg} transition-colors`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 animate-pulse">
          <div className={`h-4 w-48 rounded ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"} mb-8`} />

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div
                className={`aspect-square w-full rounded-3xl ${
                  dark ? "bg-[#202A40]" : "bg-[#E8EDF5]"
                }`}
              />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className={`h-6 w-24 rounded-full ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"}`} />
              <div className={`h-8 w-3/4 rounded ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"}`} />
              <div className={`h-4 w-1/3 rounded ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"}`} />
              <div className={`h-10 w-40 rounded ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"} mt-4`} />
              <div className={`h-24 w-full rounded-2xl ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"} mt-6`} />
              <div className={`h-12 w-full rounded-xl ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"} mt-6`} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error State
  if (isError || !product) {
    return (
      <main className={`min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 py-20 text-center ${pageBg}`}>
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-full border ${errorBg} ${errorText}`}
        >
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className={`text-2xl font-bold ${textPrimary}`}>
          Product Not Found
        </h1>

        <p className={`text-sm max-w-md ${textSecondary}`}>
          {error?.data?.message ||
            "The product you are looking for does not exist or has been removed."}
        </p>

        <Link
          to="/shop"
          className={`mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${primaryButton}`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>
      </main>
    );
  }

  const avgRating = reviewSummary?.averageRating || 0;
  const totalReviewsCount = reviewSummary?.totalReviews || 0;

  return (
    <main className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 pb-12 flex flex-col gap-8">

        {/* Breadcrumbs and Share */}
        <nav className="flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className={`flex items-center gap-1 min-w-0 ${textSecondary}`}>
            <Link
              to="/shop"
              className={`inline-flex items-center gap-1 font-semibold hover:underline shrink-0 ${accentText}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Shop</span>
            </Link>

            <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />

            {product.category && (
              <>
                <Link
                  to={`/shop?category=${encodeURIComponent(product.category)}`}
                  className="hover:underline capitalize shrink-0"
                >
                  {product.category}
                </Link>
                <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
              </>
            )}

            <span className={`font-medium truncate ${textPrimary}`}>
              {product.productName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border transition-all shrink-0 ${secondaryButton}`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? "Link Copied!" : "Share"}</span>
          </button>
        </nav>

        {/* Main Product Section */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">

          {/* Product Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div
              className={`relative aspect-square w-full rounded-3xl border overflow-hidden flex items-center justify-center p-5 sm:p-10 group ${cardBg} ${borderColor}`}
            >
              {/* Product Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider shadow-sm ${
                      dark
                        ? "bg-[#F08089] text-[#171E30]"
                        : "bg-[#C04452] text-white"
                    }`}
                  >
                    {discountPercent}% OFF
                  </span>
                )}

                {product.isFeatured && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${primaryButton}`}
                  >
                    Featured
                  </span>
                )}
              </div>

              {/* Single Wishlist Button */}
              <button
                type="button"
                onClick={handleWishlistClick}
                disabled={isCheckingUser || isAddingWishlist || isRemovingWishlist}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                className={`absolute top-4 right-4 z-10 w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 shadow-sm active:scale-90 disabled:opacity-50 ${secondaryButton}`}
              >
                <Heart
                  className={`w-5 h-5 transition-transform ${
                    isWishlisted
                      ? "text-[#C34D68] fill-[#C34D68] scale-110"
                      : ""
                  }`}
                />
              </button>

              {/* Main Product Image */}
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.productName}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className={`flex flex-col items-center justify-center text-sm ${textSecondary}`}>
                  <Package className="w-12 h-12 mb-2 stroke-1" />
                  <span>No image available</span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`View product image ${idx + 1}`}
                    className={`relative w-20 h-20 rounded-2xl border p-2 shrink-0 transition-all overflow-hidden ${
                      selectedImageIndex === idx
                        ? dark
                          ? "border-[#7895C5] ring-2 ring-[#7895C5]/40 bg-[#202A40]"
                          : "border-[#344F82] ring-2 ring-[#344F82]/30 bg-white"
                        : `${borderColor} ${cardBg} hover:border-[#7895C5]`
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Category, Rating and Title */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    dark
                      ? "bg-[#34415B] text-[#7895C5]"
                      : "bg-[#DFE7F3] text-[#344F82]"
                  }`}
                >
                  {product.category || "General"}
                </span>

                {totalReviewsCount > 0 && (
                  <div
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      dark
                        ? "bg-[#202A40] text-[#E6B66F] border-[#35435C]"
                        : "bg-[#FFF8E8] text-[#A66A22] border-[#F0DFB8]"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-[#E6B66F] text-[#E6B66F]" />
                    <span>{avgRating.toFixed(1)}</span>
                    <span className={`text-[11px] font-normal ${textSecondary}`}>
                      ({totalReviewsCount})
                    </span>
                  </div>
                )}
              </div>

              <h1 className={`mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug ${textPrimary}`}>
                {product.productName}
              </h1>

              {product.brandName && (
                <p className={`mt-1 text-sm font-medium ${textSecondary}`}>
                  Brand: <span className={`font-semibold ${textPrimary}`}>{product.brandName}</span>
                </p>
              )}
            </div>

            {/* Price Card */}
            <div className={`p-5 rounded-2xl border transition-colors ${cardBg} ${borderColor}`}>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={`text-3xl sm:text-4xl font-black ${accentText}`}>
                  {formatPrice.format(sellingPrice)}
                </span>

                {originalPrice > sellingPrice && (
                  <>
                    <span className={`text-lg line-through font-medium ${textMuted}`}>
                      {formatPrice.format(originalPrice)}
                    </span>

                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${successText} ${successBg}`}
                    >
                      Save {formatPrice.format(originalPrice - sellingPrice)}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                {isOutOfStock ? (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${errorText} ${errorBg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dark ? "bg-[#F08089]" : "bg-[#C04452]"}`} />
                    Out of Stock
                  </span>
                ) : stock <= 5 ? (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${warningText} ${warningBg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dark ? "bg-[#E6B66F]" : "bg-[#A66A22]"}`} />
                    Only {stock} items left in stock
                  </span>
                ) : (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${successText} ${successBg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dark ? "bg-[#65C995]" : "bg-[#27845B]"}`} />
                    In Stock & Ready to Ship
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className={`text-xs uppercase tracking-wider font-bold mb-2 ${textSecondary}`}>
                About this item
              </h2>

              <p className={`text-sm leading-relaxed whitespace-pre-line ${textPrimary}`}>
                {product.description ||
                  "No additional description provided for this product."}
              </p>
            </div>

            {/* Notifications */}
            {added && (
              <div className={`flex items-center gap-2 p-3 rounded-xl border ${successBg} ${successText} text-xs font-semibold`}>
                <Check className="w-4 h-4 shrink-0" />
                <span>Added to cart successfully!</span>
                <Link to="/cart" className="ml-auto underline font-bold shrink-0">
                  View Cart
                </Link>
              </div>
            )}

            {addError && (
              <p className={`text-xs font-semibold ${errorText}`}>
                {addError.data?.message || "Could not add product to cart."}
              </p>
            )}

            {buyNowError && (
              <p className={`text-xs font-semibold ${errorText}`}>
                {buyNowError}
              </p>
            )}

            {wishlistError && (
              <p className={`text-xs font-semibold ${errorText}`}>
                {wishlistError}
              </p>
            )}

{/* Responsive Purchase Actions */}
<div
  className={`fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 border-t p-3 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] backdrop-blur-md
    lg:static lg:flex-col lg:items-stretch lg:gap-3 lg:border-0 lg:p-0 lg:shadow-none lg:backdrop-blur-none
    ${
      dark
        ? "border-[#35435C] bg-[#171E30]/95 lg:bg-transparent"
        : "border-[#D8E1EF] bg-white/95 lg:bg-transparent"
    }`}
>
  <button
    type="button"
    onClick={handleAddToCart}
    disabled={isAdding || isOutOfStock}
    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 lg:w-full lg:flex-none ${
      dark
        ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
        : "bg-[#202C50] text-white hover:bg-[#344F82]"
    }`}
  >
    <ShoppingCart className="h-5 w-5" />
    {isAdding ? "Adding..." : "Add to Cart"}
  </button>

  <button
    type="button"
    onClick={handleBuyNow}
    disabled={isStartingCheckout || isOutOfStock}
    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#344F82] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#202C50] disabled:cursor-not-allowed disabled:opacity-50 lg:w-full lg:flex-none"
  >
    <Zap className="h-5 w-5" />
    {isStartingCheckout ? "Please wait..." : "Buy Now"}
  </button>
</div>

            {/* Trust Highlights */}
            <div className={`p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-2 gap-4 transition-colors ${cardBg} ${borderColor}`}>
              <div className="flex items-center gap-2.5">
                <Truck className={`w-4 h-4 shrink-0 ${accentText}`} />
                <span className={`text-xs ${textSecondary}`}>
                  Fast & reliable delivery
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className={`w-4 h-4 shrink-0 ${accentText}`} />
                <span className={`text-xs ${textSecondary}`}>
                  100% Genuine Quality
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <RotateCcw className={`w-4 h-4 shrink-0 ${accentText}`} />
                <span className={`text-xs ${textSecondary}`}>
                  Easy 7-day returns
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Lock className={`w-4 h-4 shrink-0 ${accentText}`} />
                <span className={`text-xs ${textSecondary}`}>
                  Safe & encrypted checkout
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <section className={`mt-10 rounded-3xl border p-5 sm:p-8 lg:p-10 transition-colors ${cardBg} ${borderColor}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-inherit">
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${textPrimary}`}>
                Customer Reviews
              </h2>

              <p className={`text-xs sm:text-sm mt-1 ${textSecondary}`}>
                Real ratings and feedback from verified buyers
              </p>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className={`text-2xl font-black ${accentText}`}>
                  {avgRating.toFixed(1)}
                  <span className={`text-sm font-normal ${textSecondary}`}>
                    {" "} / 5.0
                  </span>
                </p>

                <p className={`text-xs ${textSecondary}`}>
                  Based on {totalReviewsCount} review
                  {totalReviewsCount === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex text-[#E6B66F]">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-5 h-5 ${
                      starIdx <= Math.round(avgRating)
                        ? "fill-[#E6B66F] text-[#E6B66F]"
                        : textMuted
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 pt-8">
            {/* Review List */}
            <div className="lg:col-span-7 space-y-4">
              {isLoadingReviews ? (
                <p className={`text-sm ${textSecondary}`}>
                  Loading reviews...
                </p>
              ) : isReviewsError ? (
                <p className={`text-sm ${errorText}`}>
                  {reviewsError?.data?.message || "Could not load reviews."}
                </p>
              ) : reviewSummary?.reviews?.length ? (
                reviewSummary.reviews.map((rev) => (
                  <article
                    key={rev._id}
                    className={`rounded-2xl border p-4 sm:p-5 transition-colors ${softBg} ${borderColor}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                            dark
                              ? "bg-[#34415B] text-[#7895C5]"
                              : "bg-[#DFE7F3] text-[#344F82]"
                          }`}
                        >
                          {(rev.userId?.name || "C").charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className={`font-semibold text-sm truncate ${textPrimary}`}>
                            {rev.userId?.name || "Verified Customer"}
                          </p>

                          <p className={`text-[11px] ${textSecondary}`}>
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex text-[#E6B66F] shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating
                                ? "fill-[#E6B66F] text-[#E6B66F]"
                                : textMuted
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className={`mt-3 text-sm leading-relaxed whitespace-pre-wrap ${textPrimary}`}>
                      {rev.comment}
                    </p>
                  </article>
                ))
              ) : (
                <div className={`p-8 rounded-2xl border border-dashed text-center ${borderColor} ${textSecondary}`}>
                  <p className="text-sm font-medium">
                    No customer reviews yet.
                  </p>
                  <p className="text-xs mt-1">
                    Be the first to share your experience with this product!
                  </p>
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="lg:col-span-5">
              <div className={`p-5 sm:p-6 rounded-2xl border ${softBg} ${borderColor}`}>
                <h3 className={`text-base font-bold mb-1 ${textPrimary}`}>
                  Write a Review
                </h3>

                <p className={`text-xs mb-4 ${textSecondary}`}>
                  Tell others what you think about this product
                </p>

                {isCheckingUser ? (
                  <p className={`text-xs ${textSecondary}`}>
                    Checking account status...
                  </p>
                ) : user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Rating */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${textPrimary}`}>
                        Your Rating
                      </label>

                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((starNum) => (
                          <button
                            type="button"
                            key={starNum}
                            onClick={() => setRating(starNum)}
                            aria-label={`Rate ${starNum} stars`}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                starNum <= rating
                                  ? "fill-[#E6B66F] text-[#E6B66F]"
                                  : textMuted
                              }`}
                            />
                          </button>
                        ))}

                        <span className={`ml-2 text-xs font-semibold ${textSecondary}`}>
                          {rating} Star{rating > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${textPrimary}`}>
                        Your Experience
                      </label>

                      <textarea
                        required
                        maxLength={1000}
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or dislike about this product?"
                        className={`w-full p-3 rounded-xl border text-sm outline-none transition-colors ${inputStyle}`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${primaryButton}`}
                    >
                      {isSubmittingReview
                        ? "Submitting..."
                        : "Submit Your Review"}
                    </button>

                    {reviewMessage && (
                      <p
                        className={`text-xs font-semibold mt-2 ${
                          reviewMessage.startsWith("Thank you")
                            ? successText
                            : errorText
                        }`}
                      >
                        {reviewMessage}
                      </p>
                    )}
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className={`text-xs ${textSecondary}`}>
                      Please{" "}
                      <Link
                        to="/login"
                        className={`font-bold underline ${accentText}`}
                      >
                        sign in
                      </Link>{" "}
                      to post your rating and review.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
