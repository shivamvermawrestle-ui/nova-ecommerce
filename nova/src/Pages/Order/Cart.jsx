
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useCreatePaymentSessionMutation,
  useDeleteCartProductMutation,
  useGetCartQuery,
  useUpdateCartProductMutation,
} from "../../services/productsApi";

import { UseGlob } from "../../Context/GlobalContext";

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Lock,
  Sparkles,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";

const Cart = () => {
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useGetCartQuery();

  const { navigate, formatPrice, dark } = UseGlob();

  const [updateCartProduct] = useUpdateCartProductMutation();
  const [deleteCartProduct] = useDeleteCartProductMutation();

  const [createPaymentSession, { isLoading: isCheckingOut }] =
    useCreatePaymentSessionMutation();

  const [checkoutError, setCheckoutError] = useState("");
  const [actionError, setActionError] = useState("");

  // Theme styles
  const pageBg = dark ? "bg-[#171E30]" : "bg-[#F7F9FC]";
  const cardBg = dark ? "bg-[#202A40]" : "bg-white";
  const textPrimary = dark ? "text-[#EAF0FA]" : "text-[#202C50]";
  const textSecondary = dark ? "text-[#AAB8D0]" : "text-[#64718A]";
  const borderColor = dark ? "border-[#35435C]" : "border-[#D8E1EF]";
  const blueButton = dark
    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
    : "bg-[#202C50] text-white hover:bg-[#344F82]";

  // Checkout
  const handleCheckout = async () => {
    try {
      setCheckoutError("");

      const result = await createPaymentSession().unwrap();

      window.location.assign(result.data.url);
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate("/login");
        return;
      }

      setCheckoutError(
        requestError?.data?.message ||
          "Could not start checkout. Please try again."
      );
    }
  };

  // Update quantity
  async function updateQuantity(cartItemId, quantity) {
    try {
      setActionError("");

      await updateCartProduct({
        _id: cartItemId,
        quantity,
      }).unwrap();
    } catch (requestError) {
      setActionError(
        requestError?.data?.message ||
          "Could not update item quantity."
      );
    }
  }

  // Remove item
  async function removeItem(cartItemId) {
    try {
      setActionError("");

      await deleteCartProduct(cartItemId).unwrap();
    } catch (requestError) {
      setActionError(
        requestError?.data?.message ||
          "Could not remove this item."
      );
    }
  }

  // Loading State
  if (isLoading) {
    return (
      <main className={`${pageBg} min-h-screen transition-colors`}>
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">

          <div className="space-y-3 mb-8">
            <div className={`h-4 w-32 rounded-lg animate-pulse ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"}`} />
            <div className={`h-9 w-48 rounded-lg animate-pulse ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"}`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-5">

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`flex gap-4 rounded-2xl border p-4 animate-pulse ${cardBg} ${borderColor}`}
                >
                  <div className={`h-24 w-24 shrink-0 rounded-xl ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"}`} />

                  <div className="flex-1 space-y-3">
                    <div className={`h-3 w-1/3 rounded ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"}`} />
                    <div className={`h-5 w-3/4 rounded ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"}`} />
                    <div className={`h-4 w-20 rounded ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"}`} />
                  </div>
                </div>
              ))}
            </div>

            <div className={`h-72 rounded-2xl animate-pulse ${dark ? "bg-[#202A40]" : "bg-[#D8E1EF]"}`} />

          </div>
        </div>
      </main>
    );
  }

  // Error State
  if (isError) {
    return (
      <main className={`${pageBg} min-h-[70vh] flex items-center justify-center px-4 py-12`}>
        <div className={`w-full max-w-md rounded-3xl border p-6 sm:p-9 text-center shadow-sm ${cardBg} ${borderColor}`}>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <ShoppingBag size={30} />
          </div>

          <h2 className={`mt-5 text-xl sm:text-2xl font-bold ${textPrimary}`}>
            {error?.status === 401
              ? "Please Sign In to View Your Cart"
              : "Could Not Load Your Cart"}
          </h2>

          <p className={`mt-3 text-sm leading-relaxed ${textSecondary}`}>
            {error?.status === 401
              ? "Your shopping bag is saved to your account. Log in to continue shopping."
              : error?.data?.message ||
                "There was an issue fetching your cart. Please try again."}
          </p>

          <Link
            to={error?.status === 401 ? "/login" : "/shop"}
            className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all active:scale-95 ${blueButton}`}
          >
            {error?.status === 401 ? "Log In Now" : "Back to Shop"}
            <ArrowRight size={16} />
          </Link>

        </div>
      </main>
    );
  }

  // Calculate subtotal and quantity
  const totalItemCount = items.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const subtotal = items.reduce((total, item) => {
    const product = item.productId;
    const price = Number(
      product?.sellingPrice ?? product?.price ?? 0
    );

    return total + price * Number(item.quantity || 1);
  }, 0);

  // Free delivery above 499
  const isFreeDelivery = subtotal >= 499;

  const deliveryCharge = isFreeDelivery ? 0 : 40;

  // Empty Cart
  if (items.length === 0) {
    return (
      <main className={`${pageBg} min-h-[75vh] flex items-center justify-center px-3 sm:px-6 py-12 transition-colors`}>

        <div className={`w-full max-w-lg rounded-3xl border p-7 sm:p-12 text-center shadow-sm ${cardBg} ${borderColor}`}>

          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${dark ? "bg-[#7895C5]/15 text-[#7895C5]" : "bg-[#202C50]/10 text-[#202C50]"}`}>
            <ShoppingCart size={38} />
          </div>

          <h1 className={`mt-6 text-2xl sm:text-3xl font-extrabold ${textPrimary}`}>
            Your Cart is Empty
          </h1>

          <p className={`mx-auto mt-3 max-w-sm text-sm leading-relaxed ${textSecondary}`}>
            Looks like you haven't added anything to your cart yet.
            Explore our collections and find something you love!
          </p>

          <Link
            to="/shop"
            className={`mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold transition-all active:scale-95 ${blueButton}`}
          >
            Explore Products
            <ArrowRight size={17} />
          </Link>

        </div>
      </main>
    );
  }

  // Check stock issues
  const hasStockIssue = items.some((item) => {
    const product = item.productId;
    const stock = Number(product?.stock ?? 0);
    const quantity = Number(item.quantity ?? 1);

    return !product || stock < 1 || quantity > stock;
  });

  return (
    <main className={`${pageBg} min-h-screen transition-colors duration-200`}>

      <div className="mx-auto  flex flex-col gap-4 w-full max-w-7xl px-3 sm:px-5 lg:px-8 py-5 sm:py-8 lg:py-10">

        {/* Header */}
        <header className={`  flex  gap-4  ${borderColor} items-baseline justify-between`}>

          <div className="space-y-2">


            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${textPrimary}`}>
              Shopping Cart
            </h1>

            <p className={`text-xs sm:text-sm ${textSecondary}`}>
              Review your bag and checkout securely.
            </p>

          </div>

          <div className={`flex text-nowrap  items-center gap-2 rounded-md border px-4 py-1 text-xs font-bold ${dark ? "border-[#35435C] bg-[#202A40] text-[#7895C5]" : "border-[#D8E1EF] bg-[#DFE7F3] text-[#202C50]"}`}>
            <ShoppingBag size={14} />
            {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}
          </div>

        </header>

        {/* Action Error */}
        {actionError && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-500">
            <AlertCircle size={18} className="shrink-0" />
            {actionError}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-7">

          {/* Cart Items */}
          <section className="min-w-0 space-y-4">

            {items.map((item) => {
              const product = item.productId;

              const price = Number(
                product?.sellingPrice ?? product?.price ?? 0
              );

              const originalPrice = Number(product?.price ?? 0);
              const quantity = Number(item.quantity || 1);
              const stock = Number(product?.stock ?? 0);

              const quantityExceedsStock = quantity > stock;

              return (
                <article
                  key={item._id}
                  className={`group rounded-2xl border p-3 sm:p-5 transition-all duration-200 hover:shadow-md ${cardBg} ${borderColor}`}
                >

                  {/* Product Information */}
                  <div className="flex min-w-0 gap-3 sm:gap-5">

                    {/* Product Image */}
                    <Link
                      to={product?._id ? `/product/${product._id}` : "#"}
                      className={`flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border transition-colors ${dark ? "border-[#35435C] bg-[#171E30]" : "border-[#D8E1EF] bg-[#F7F9FC]"}`}
                    >
                      {product?.productImage?.[0] ? (
                        <img
                          src={product.productImage[0]}
                          alt={product.productName || "Cart product"}
                          className="h-full w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <ShoppingBag className={textSecondary} size={30} />
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">

                      <div className="min-w-0">

                        <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                          {product?.brandName || "Brand"}
                        </p>

                        <Link
                          to={product?._id ? `/product/${product._id}` : "#"}
                        >
                          <h2 className={`mt-1 line-clamp-2 text-sm sm:text-base font-bold leading-snug transition-colors ${textPrimary} hover:text-[#344F82] dark:hover:text-[#7895C5]`}>
                            {product?.productName || "Product unavailable"}
                          </h2>
                        </Link>

                        <div className="mt-2 flex flex-wrap items-center gap-2">

                          <span className={`text-sm sm:text-base font-extrabold ${dark ? "text-[#7895C5]" : "text-[#202C50]"}`}>
                            {formatPrice.format(price)}
                          </span>

                          {originalPrice > price && (
                            <span className={`text-xs line-through ${textSecondary}`}>
                              {formatPrice.format(originalPrice)}
                            </span>
                          )}

                        </div>

                      </div>

                      {/* Stock Messages */}
                      {!product || stock < 1 ? (
                        <span className="text-[11px] sm:text-xs font-semibold text-[#C04452] dark:text-[#F08089]">
                          Out of stock — remove to proceed
                        </span>
                      ) : quantityExceedsStock ? (
                        <span className="text-[11px] sm:text-xs font-semibold text-[#A66A22] dark:text-[#E6B66F]">
                          Only {stock} available — reduce quantity
                        </span>
                      ) : stock <= 5 ? (
                        <span className="text-[11px] font-medium text-[#A66A22] dark:text-[#E6B66F]">
                          Only {stock} left in stock
                        </span>
                      ) : null}

                    </div>

                  </div>

                  {/* Quantity and Price Section */}
                  <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed pt-4 ${borderColor}`}>

                    {/* Quantity Controller */}
                    <div className="flex items-center gap-2 sm:gap-3">

                      <div className={`flex items-center gap-1 rounded-xl border p-1 ${dark ? "border-[#35435C] bg-[#171E30]" : "border-[#D8E1EF] bg-[#F7F9FC]"}`}>

                        <button
                          type="button"
                          disabled={quantity <= 1}
                          onClick={() => updateQuantity(item._id, quantity - 1)}
                          aria-label="Decrease quantity"
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${dark ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]" : "border-[#D8E1EF] bg-white text-[#202C50] hover:bg-[#EDF2F9]"}`}
                        >
                          <Minus size={15} />
                        </button>

                        <span className={`w-9 text-center text-sm font-bold ${textPrimary}`}>
                          {quantity}
                        </span>

                        <button
                          type="button"
                          disabled={!product || quantity >= stock}
                          onClick={() => updateQuantity(item._id, quantity + 1)}
                          aria-label="Increase quantity"
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${dark ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]" : "border-[#D8E1EF] bg-white text-[#202C50] hover:bg-[#EDF2F9]"}`}
                        >
                          <Plus size={15} />
                        </button>

                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item._id)}
                        title="Remove item from cart"
                        aria-label="Remove item from cart"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 transition-all hover:bg-red-500/20 active:scale-95"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                    {/* Item Total */}
                    <div className="text-right">

                      <p className={`text-[10px] sm:text-xs ${textSecondary}`}>
                        Item Total
                      </p>

                      <p className={`text-base sm:text-lg font-extrabold tracking-tight ${textPrimary}`}>
                        {formatPrice.format(price * quantity)}
                      </p>

                    </div>

                  </div>

                </article>
              );
            })}

          </section>

          {/* Order Summary */}
          <aside className={`w-full rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-sm transition-colors lg:sticky lg:top-24 ${cardBg} ${borderColor}`}>

            {/* Summary Header */}
            <div className={`flex items-center justify-between border-b pb-4 ${borderColor}`}>

              <h2 className={`text-lg sm:text-xl font-extrabold ${textPrimary}`}>
                Order Summary
              </h2>

              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${dark ? "bg-[#7895C5]/15 text-[#7895C5]" : "bg-[#202C50]/10 text-[#202C50]"}`}>
                <Sparkles size={18} />
              </div>

            </div>

            {/* Pricing */}
            <div className="mt-5 space-y-4 text-sm">

              <div className="flex items-center justify-between gap-3">

                <span className={textSecondary}>
                  Subtotal ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})
                </span>

                <span className={`font-semibold ${textPrimary}`}>
                  {formatPrice.format(subtotal)}
                </span>

              </div>

              <div className="flex items-center justify-between gap-3">

                <span className={textSecondary}>
                  Estimated Delivery
                </span>

                {isFreeDelivery ? (
                  <span className="font-bold text-[#27845B] dark:text-[#65C995]">
                    FREE
                  </span>
                ) : (
                  <span className={`font-semibold ${textPrimary}`}>
                    {formatPrice.format(40)}
                  </span>
                )}

              </div>

              <div className="flex items-center justify-between gap-3">

                <span className={textSecondary}>
                  Applicable Taxes
                </span>

                <span className="font-semibold text-[#27845B] dark:text-[#65C995]">
                  Included
                </span>

              </div>

              {/* Free Delivery Progress */}
              {!isFreeDelivery && (
                <div className={`rounded-xl border p-3 ${dark ? "border-[#35435C] bg-[#171E30]" : "border-[#D8E1EF] bg-[#DFE7F3]"}`}>

                  <p className={`text-xs leading-relaxed ${textPrimary}`}>
                    Add{" "}
                    <span className="font-extrabold text-[#202C50] dark:text-[#7895C5]">
                      {formatPrice.format(499 - subtotal)}
                    </span>{" "}
                    more to get{" "}
                    <span className="font-bold text-[#27845B] dark:text-[#65C995]">
                      FREE Delivery!
                    </span>
                  </p>

                  <div className={`mt-3 h-2 overflow-hidden rounded-full ${dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"}`}>
                    <div
                      className="h-full rounded-full bg-[#202C50] dark:bg-[#7895C5] transition-all duration-300"
                      style={{
                        width: `${Math.min((subtotal / 499) * 100, 100)}%`,
                      }}
                    />
                  </div>

                </div>
              )}

              {/* Total */}
              <div className={`flex items-center justify-between gap-3 border-t border-dashed pt-5 ${borderColor}`}>

                <span className={`text-sm font-bold ${textPrimary}`}>
                  Total Amount
                </span>

                <span className={`text-xl sm:text-2xl font-black tracking-tight ${dark ? "text-[#7895C5]" : "text-[#202C50]"}`}>
                  {formatPrice.format(subtotal + deliveryCharge)}
                </span>

              </div>

            </div>

            {/* Checkout Button */}
            <div className="mt-6">

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut || hasStockIssue}
                className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${blueButton}`}
              >

                <Lock size={16} />

                <span>
                  {isCheckingOut
                    ? "Opening Checkout..."
                    : "Proceed to Checkout"}
                </span>

                {!isCheckingOut && <ArrowRight size={17} />}

              </button>

            </div>

            {/* Checkout Error */}
            {checkoutError && (
              <p className="mt-3 text-center text-xs font-semibold text-[#C04452] dark:text-[#F08089]">
                {checkoutError}
              </p>
            )}

            {/* Stock Notice */}
            {hasStockIssue && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-xs font-medium text-amber-500">
                <AlertCircle size={16} className="shrink-0" />
                Please resolve out-of-stock items before checkout.
              </div>
            )}

            {/* Trust Badges */}
            <div className={`mt-6 space-y-3 border-t pt-5 ${borderColor}`}>

              <div className={`flex items-center gap-3 text-xs ${textSecondary}`}>
                <ShieldCheck size={17} className="shrink-0 text-[#27845B] dark:text-[#65C995]" />
                <span>100% Secure Payment with Stripe</span>
              </div>

              <div className={`flex items-center gap-3 text-xs ${textSecondary}`}>
                <Truck size={17} className="shrink-0 text-[#202C50] dark:text-[#7895C5]" />
                <span>Fast Doorstep Delivery with Tracking</span>
              </div>

            </div>

          </aside>

        </div>

        {/* Bottom Continue Shopping */}
        <div className={`mt-8 border-t pt-5  flex justify-center ${borderColor}`}>

          <Link
            to="/shop"
            className={`inline-flex items-center gap-2 text-sm  px-4 py-2 border rounded-xl font-semibold transition-colors ${dark ? "text-[#7895C5] hover:text-[#9BB2D8]" : "text-[#202C50] hover:text-[#344F82]"}`}
          >
            <ArrowRight size={16} className="rotate-180" />
            Continue Shopping
          </Link>

        </div>

      </div>

    </main>
  );
};

export default Cart;
