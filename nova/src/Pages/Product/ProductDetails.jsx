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
  const params = useParams();
  const id = params.id;

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

  const images = Array.isArray(product?.productImage)
    ? product.productImage.filter(Boolean)
    : product?.productImage
    ? [product.productImage]
    : [];
  const activeImage = images[selectedImageIndex] || images[0];

  const originalPrice = Number(product?.price ?? 0);
  const sellingPrice = Number(product?.sellingPrice ?? product?.price ?? 0);
  const discountPercent =
    originalPrice > sellingPrice && originalPrice > 0
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : 0;

  const stock = Number(product?.stock ?? 0);
  const isOutOfStock = stock < 1;

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id).unwrap();
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate("/login");
      }
    }
  };

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

  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Skeleton Loader State
  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 animate-pulse">
        <div className="h-4 w-48 rounded bg-gray-200 dark:bg-[#202A40] mb-8" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="aspect-square w-full rounded-3xl bg-gray-200 dark:bg-[#202A40]" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-[#202A40]" />
            <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-[#202A40]" />
            <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-[#202A40]" />
            <div className="h-10 w-40 rounded bg-gray-200 dark:bg-[#202A40] mt-4" />
            <div className="h-24 w-full rounded-2xl bg-gray-200 dark:bg-[#202A40] mt-6" />
            <div className="h-12 w-full rounded-xl bg-gray-200 dark:bg-[#202A40] mt-6" />
          </div>
        </div>
      </main>
    );
  }

  // Error State
  if (isError || !product) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-full border ${
            dark
              ? "bg-[#C04452]/10 border-[#C04452]/20 text-[#F08089]"
              : "bg-red-50 border-red-200 text-[#C04452]"
          }`}
        >
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1
          className={`text-2xl font-bold ${
            dark ? "text-[#EAF0FA]" : "text-[#202C50]"
          }`}
        >
          Product Not Found
        </h1>
        <p
          className={`text-sm max-w-md ${
            dark ? "text-[#AAB8D0]" : "text-[#64718A]"
          }`}
        >
          {error?.data?.message ||
            "The product you are looking for does not exist or has been removed."}
        </p>
        <Link
          to="/shop"
          className={`mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            dark
              ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
              : "bg-[#202C50] text-white hover:bg-[#344F82]"
          }`}
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
    <main
      className={`min-h-screen transition-colors duration-300 ${
        dark ? "bg-[#171E30]" : "bg-[#F7F9FC]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 pb-28 lg:pb-16 flex flex-col gap-8">
        {/* Navigation Breadcrumbs & Back */}
        <nav className="flex items-center justify-between gap-1 text-xs sm:text-sm">
          <div
            className={`flex items-center gap-1  ${
              dark ? "text-[#AAB8D0]" : "text-[#64718A]"
            }`}
          >
            <Link
              to="/shop"
              className={`inline-flex items-center gap-1 font-semibold hover:underline ${
                dark ? "text-[#7895C5]" : "text-[#202C50]"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Shop</span>
            </Link>
            <ChevronRight className="w-3 h-3 opacity-60" />
            {product.category && (
              <>
                <Link
                  to={`/shop?category=${encodeURIComponent(product.category)}`}
                  className="hover:underline capitalize"
                >
                  {product.category}
                </Link>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </>
            )}
            <span
              className={`font-medium truncate  max-w-[100px] sm:max-w-xs ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              {product.productName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              dark
                ? "border-[#35435C] bg-[#202A40] text-[#AAB8D0] hover:text-[#EAF0FA]"
                : "border-[#D8E1EF] bg-white text-[#64718A] hover:text-[#202C50]"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? "Link Copied!" : "Share"}</span>
          </button>
        </nav>

        {/* Main Product Showcase Section */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Image Gallery & Badges (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div
              className={`relative aspect-square w-full rounded-3xl border overflow-hidden transition-all duration-300 flex items-center justify-center p-6 sm:p-10 group ${
                dark
                  ? "bg-[#202A40] border-[#35435C]"
                  : "bg-white border-[#D8E1EF]"
              }`}
            >
              {/* Top Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <span className="rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider bg-[#B74747] text-white shadow-sm dark:bg-[#F08080] dark:text-[#171E30]">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.isFeatured && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      dark
                        ? "bg-[#7895C5] text-[#171E30]"
                        : "bg-[#202C50] text-white"
                    }`}
                  >
                    Featured
                  </span>
                )}
              </div>

              {/* Wishlist Button on Image */}
              <button
                type="button"
                onClick={handleWishlistClick}
                disabled={isCheckingUser || isAddingWishlist}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                className={`absolute top-4 right-4 z-10 w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 shadow-sm active:scale-90 ${
                  dark
                    ? "bg-[#171E30]/80 hover:bg-[#171E30] border-[#35435C] text-[#EAF0FA]"
                    : "bg-white/90 hover:bg-white border-[#D8E1EF] text-[#202C50]"
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-transform ${
                    isWishlisted
                      ? "text-[#C34D68] fill-[#C34D68] dark:text-[#F08BA1] dark:fill-[#F08BA1] scale-110"
                      : "text-inherit"
                  }`}
                />
              </button>

              {/* Product Hero Image */}
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.productName}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div
                  className={`flex flex-col items-center justify-center text-sm ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  <Package className="w-12 h-12 mb-2 stroke-1" />
                  <span>No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Selector (if multiple images) */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl border p-2 shrink-0 transition-all overflow-hidden ${
                      selectedImageIndex === idx
                        ? dark
                          ? "border-[#7895C5] ring-2 ring-[#7895C5]/40 bg-[#202A40]"
                          : "border-[#202C50] ring-2 ring-[#202C50]/30 bg-white"
                        : dark
                        ? "border-[#35435C] bg-[#202A40]/50 hover:border-[#7895C5]"
                        : "border-[#D8E1EF] bg-white hover:border-[#344F82]"
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

          {/* Right Column: Details, Pricing, Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Category, Title & Brand */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    dark
                      ? "bg-[#34415B] text-[#7895C5]"
                      : "bg-[#DFE7F3] text-[#202C50]"
                  }`}
                >
                  {product.category || "General"}
                </span>

                {/* Star rating summary snippet */}
                {totalReviewsCount > 0 && (
                  <div
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      dark
                        ? "bg-[#202A40] text-amber-400 border border-[#35435C]"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{avgRating.toFixed(1)}</span>
                    <span
                      className={`text-[11px] font-normal ${
                        dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                      }`}
                    >
                      ({totalReviewsCount})
                    </span>
                  </div>
                )}
              </div>

              <h1
                className={`mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {product.productName}
              </h1>

              {product.brandName && (
                <p
                  className={`mt-1 text-sm font-medium ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Brand: <span className="font-semibold">{product.brandName}</span>
                </p>
              )}
            </div>

            {/* Price Card */}
            <div
              className={`p-5 rounded-2xl border transition-colors ${
                dark
                  ? "bg-[#202A40] border-[#35435C]"
                  : "bg-white border-[#D8E1EF]"
              }`}
            >
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  className={`text-3xl sm:text-4xl font-black ${
                    dark ? "text-[#7895C5]" : "text-[#202C50]"
                  }`}
                >
                  {formatPrice.format(sellingPrice)}
                </span>

                {originalPrice > sellingPrice && (
                  <>
                    <span
                      className={`text-lg line-through font-medium ${
                        dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                      }`}
                    >
                      {formatPrice.format(originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-[#27845B] dark:text-[#65C995] bg-[#27845B]/10 px-2 py-0.5 rounded-full">
                      Save {formatPrice.format(originalPrice - sellingPrice)}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status Badge */}
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-[#C04452] dark:text-[#F08089] bg-[#C04452]/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C04452] dark:bg-[#F08089]" />
                    Out of Stock
                  </span>
                ) : stock <= 5 ? (
                  <span className="inline-flex items-center gap-1.5 text-[#A66A22] dark:text-[#E6B66F] bg-[#A66A22]/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A66A22] dark:bg-[#E6B66F] animate-pulse" />
                    Only {stock} items left in stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[#27845B] dark:text-[#65C995] bg-[#27845B]/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27845B] dark:bg-[#65C995]" />
                    In Stock & Ready to Ship
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2
                className={`text-xs uppercase tracking-wider font-bold mb-2 ${
                  dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                }`}
              >
                About this item
              </h2>
              <p
                className={`text-sm leading-relaxed whitespace-pre-line ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {product.description ||
                  "No additional description provided for this product."}
              </p>
            </div>

            {/* Notifications */}
            {added && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#27845B]/10 border border-[#27845B]/20 text-[#27845B] dark:text-[#65C995] text-xs font-semibold">
                <Check className="w-4 h-4" />
                <span>Added to cart successfully!</span>
                <Link to="/cart" className="ml-auto underline font-bold">
                  View Cart
                </Link>
              </div>
            )}
            {addError && (
              <p className="text-xs font-semibold text-[#C04452] dark:text-[#F08089]">
                {addError.data?.message || "Could not add product to cart."}
              </p>
            )}
            {buyNowError && (
              <p className="text-xs font-semibold text-[#C04452] dark:text-[#F08089]">
                {buyNowError}
              </p>
            )}
            {wishlistError && (
              <p className="text-xs font-semibold text-[#C04452] dark:text-[#F08089]">
                {wishlistError}
              </p>
            )}

            {/* Primary Action Buttons (Desktop / In-Flow) */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding || isOutOfStock}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md ${
                    dark
                      ? "bg-[#7895C5] hover:bg-[#9BB2D8] text-[#171E30] shadow-[#7895C5]/10"
                      : "bg-[#202C50] hover:bg-[#344F82] text-white shadow-[#202C50]/15"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {isOutOfStock
                      ? "Out of Stock"
                      : isAdding
                      ? "Adding to Cart..."
                      : "Add to Cart"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isCheckingUser || isStartingCheckout || isOutOfStock}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                    dark
                      ? "bg-[#202A40] border-[#35435C] text-[#EAF0FA] hover:bg-[#2D3B56]"
                      : "bg-white border-[#D8E1EF] text-[#202C50] hover:bg-[#EDF2F9]"
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>
                    {isStartingCheckout ? "Opening Checkout..." : "Buy Now"}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleWishlistClick}
                disabled={isCheckingUser || isAddingWishlist}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs border flex items-center justify-center gap-2 transition-colors ${
                  dark
                    ? "border-[#35435C] bg-[#202A40]/50 text-[#AAB8D0] hover:text-[#EAF0FA]"
                    : "border-[#D8E1EF] bg-white text-[#64718A] hover:text-[#202C50]"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? "text-[#C34D68] fill-[#C34D68] dark:text-[#F08BA1] dark:fill-[#F08BA1]" : ""
                  }`}
                />
                <span>
                  {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
                </span>
              </button>
            </div>

            {/* Trust & Guarantee Highlights */}
            <div
              className={`p-4 rounded-2xl border grid grid-cols-2 gap-3 transition-colors ${
                dark
                  ? "bg-[#202A40]/40 border-[#35435C]"
                  : "bg-white/80 border-[#D8E1EF]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck
                  className={`w-4 h-4 shrink-0 ${
                    dark ? "text-[#7895C5]" : "text-[#202C50]"
                  }`}
                />
                <span
                  className={`text-xs ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Fast & reliable delivery
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck
                  className={`w-4 h-4 shrink-0 ${
                    dark ? "text-[#7895C5]" : "text-[#202C50]"
                  }`}
                />
                <span
                  className={`text-xs ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  100% Genuine Quality
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw
                  className={`w-4 h-4 shrink-0 ${
                    dark ? "text-[#7895C5]" : "text-[#202C50]"
                  }`}
                />
                <span
                  className={`text-xs ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Easy 7-day returns
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Lock
                  className={`w-4 h-4 shrink-0 ${
                    dark ? "text-[#7895C5]" : "text-[#202C50]"
                  }`}
                />
                <span
                  className={`text-xs ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Safe & encrypted checkout
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section
          className={`mt-10 rounded-3xl border p-6 sm:p-10 transition-colors ${
            dark
              ? "bg-[#202A40] border-[#35435C]"
              : "bg-white border-[#D8E1EF]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D8E1EF] dark:border-[#35435C]">
            <div>
              <h2
                className={`text-xl sm:text-2xl font-bold tracking-tight ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                Customer Reviews
              </h2>
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                }`}
              >
                Real ratings and feedback from verified buyers
              </p>
            </div>

            {/* Rating summary pill */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p
                  className={`text-2xl font-black ${
                    dark ? "text-[#7895C5]" : "text-[#202C50]"
                  }`}
                >
                  {avgRating.toFixed(1)}
                  <span
                    className={`text-sm font-normal ${
                      dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                    }`}
                  >
                    {" "}
                    / 5.0
                  </span>
                </p>
                <p
                  className={`text-xs ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Based on {totalReviewsCount} review
                  {totalReviewsCount === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-5 h-5 ${
                      starIdx <= Math.round(avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 pt-8">
            {/* Left side: Review list (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {isLoadingReviews ? (
                <p
                  className={`text-sm ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Loading reviews...
                </p>
              ) : isReviewsError ? (
                <p className="text-sm text-[#C04452] dark:text-[#F08089]">
                  {reviewsError?.data?.message || "Could not load reviews."}
                </p>
              ) : reviewSummary?.reviews?.length ? (
                reviewSummary.reviews.map((rev) => (
                  <article
                    key={rev._id}
                    className={`rounded-2xl border p-4 sm:p-5 transition-colors ${
                      dark
                        ? "bg-[#171E30]/50 border-[#35435C]"
                        : "bg-[#F7F9FC]/60 border-[#D8E1EF]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                            dark
                              ? "bg-[#34415B] text-[#7895C5]"
                              : "bg-[#DFE7F3] text-[#202C50]"
                          }`}
                        >
                          {(rev.userId?.name || "C").charAt(0)}
                        </div>
                        <div>
                          <p
                            className={`font-semibold text-sm ${
                              dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                            }`}
                          >
                            {rev.userId?.name || "Verified Customer"}
                          </p>
                          <p
                            className={`text-[11px] ${
                              dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                            }`}
                          >
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p
                      className={`mt-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                      }`}
                    >
                      {rev.comment}
                    </p>
                  </article>
                ))
              ) : (
                <div
                  className={`p-8 rounded-2xl border border-dashed text-center ${
                    dark
                      ? "border-[#35435C] text-[#AAB8D0]"
                      : "border-[#D8E1EF] text-[#64718A]"
                  }`}
                >
                  <p className="text-sm font-medium">No customer reviews yet.</p>
                  <p className="text-xs mt-1">
                    Be the first to share your experience with this product!
                  </p>
                </div>
              )}
            </div>

            {/* Right side: Add Review Form (5 cols) */}
            <div className="lg:col-span-5">
              <div
                className={`p-6 rounded-2xl border ${
                  dark
                    ? "bg-[#171E30]/70 border-[#35435C]"
                    : "bg-[#F7F9FC] border-[#D8E1EF]"
                }`}
              >
                <h3
                  className={`text-base font-bold mb-1 ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  Write a Review
                </h3>
                <p
                  className={`text-xs mb-4 ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Tell others what you think about this product
                </p>

                {isCheckingUser ? (
                  <p
                    className={`text-xs ${
                      dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                    }`}
                  >
                    Checking account status...
                  </p>
                ) : user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Star Rating Select / Buttons */}
                    <div>
                      <label
                        className={`block text-xs font-semibold mb-1.5 ${
                          dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                        }`}
                      >
                        Your Rating
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((starNum) => (
                          <button
                            type="button"
                            key={starNum}
                            onClick={() => setRating(starNum)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                starNum <= rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          </button>
                        ))}
                        <span
                          className={`ml-2 text-xs font-semibold ${
                            dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                          }`}
                        >
                          {rating} Star{rating > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label
                        className={`block text-xs font-semibold mb-1.5 ${
                          dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                        }`}
                      >
                        Your Experience
                      </label>
                      <textarea
                        required
                        maxLength={1000}
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or dislike about this product?"
                        className={`w-full p-3 rounded-xl border text-sm outline-none transition-colors ${
                          dark
                            ? "bg-[#202A40] border-[#465570] text-[#EAF0FA] placeholder-[#8190AA] focus:border-[#9BB2D8]"
                            : "bg-white border-[#C9D5E7] text-[#202C50] placeholder-[#8A96AA] focus:border-[#7895C5]"
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
                        dark
                          ? "bg-[#7895C5] hover:bg-[#9BB2D8] text-[#171E30]"
                          : "bg-[#202C50] hover:bg-[#344F82] text-white"
                      }`}
                    >
                      {isSubmittingReview
                        ? "Submitting..."
                        : "Submit Your Review"}
                    </button>

                    {reviewMessage && (
                      <p className="text-xs font-semibold text-[#27845B] dark:text-[#65C995] mt-2">
                        {reviewMessage}
                      </p>
                    )}
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p
                      className={`text-xs ${
                        dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                      }`}
                    >
                      Please{" "}
                      <Link
                        to="/login"
                        className={`font-bold underline ${
                          dark ? "text-[#7895C5]" : "text-[#202C50]"
                        }`}
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

      {/* Floating Bottom Sticky Bar on Mobile Devices */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 p-3 sm:hidden backdrop-blur-md border-t transition-colors shadow-2xl ${
          dark
            ? "bg-[#171E30]/95 border-[#35435C]"
            : "bg-white/95 border-[#D8E1EF]"
        }`}
      >
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={handleWishlistClick}
            disabled={isCheckingUser || isAddingWishlist}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
              dark
                ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
                : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50]"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                isWishlisted ? "text-[#C34D68] fill-[#C34D68] dark:text-[#F08BA1] dark:fill-[#F08BA1]" : ""
              }`}
            />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 ${
              dark
                ? "bg-[#7895C5] text-[#171E30]"
                : "bg-[#202C50] text-white"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>
              {isOutOfStock
                ? "Out of Stock"
                : isAdding
                ? "Adding..."
                : "Add to Cart"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isCheckingUser || isStartingCheckout || isOutOfStock}
            className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all disabled:opacity-50 ${
              dark
                ? "bg-[#202A40] border-[#35435C] text-[#EAF0FA]"
                : "bg-[#F7F9FC] border-[#D8E1EF] text-[#202C50]"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{isStartingCheckout ? "Opening..." : "Buy Now"}</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
