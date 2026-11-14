import { Link, useSearchParams } from "react-router-dom";
import { useGetCheckoutConfirmationQuery } from "../../services/productsApi";
import { useEffect, useState } from "react";
import { UseGlob } from "../../Context/GlobalContext";
import {
  CheckCircle2,
  Package,
  Truck,
  Mail,
  ArrowRight,
  ShoppingBag,
  Loader2,
  AlertCircle,
  RotateCcw,
  LogIn,
} from "lucide-react";

const PaymentSuccess = () => {
  const { dark, formatPrice } = UseGlob();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [pollingEnabled, setPollingEnabled] = useState(true);
  const { data, isLoading, isError, error, isFetching, refetch } =
    useGetCheckoutConfirmationQuery(sessionId, {
      skip: !sessionId,
      pollingInterval: ({ data, error }) =>
        pollingEnabled && !data?.success && !error ? 2500 : 0,
    });

  useEffect(() => {
    if (!sessionId || !pollingEnabled || data?.success || isError) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setPollingEnabled(false);
    }, 30_000);
    return () => window.clearTimeout(timeoutId);
  }, [sessionId, pollingEnabled, data?.success, isError]);

  const checkStatus = () => {
    setPollingEnabled(true);
    refetch();
  };

  const order = data?.data;

  return (
    <main
      className={`min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 transition-colors duration-300 ${
        dark ? "bg-[#171E30]" : "bg-[#F7F9FC]"
      }`}
    >
      <div
        className={`w-full max-w-xl rounded-3xl border p-6 sm:p-10 text-center transition-all duration-300 shadow-xl ${
          dark
            ? "border-[#35435C] bg-[#202A40] shadow-black/40 text-[#EAF0FA]"
            : "border-[#D8E1EF] bg-white shadow-[#202C50]/5 text-[#202C50]"
        }`}
      >
        {/* Missing Session ID State */}
        {!sessionId && (
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-20 h-20 rounded-full border mb-6 ${
                dark
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400 ring-8 ring-amber-500/5"
                  : "bg-amber-50 border-amber-200 text-amber-600 ring-8 ring-amber-500/5"
              }`}
            >
              <AlertCircle className="w-10 h-10 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Order Not Found
            </h1>
            <p
              className={`mt-2 text-sm sm:text-base max-w-md ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              This checkout link is missing its transaction session reference.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link
                to="/orders"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  dark
                    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                    : "bg-[#202C50] text-white hover:bg-[#344F82]"
                }`}
              >
                <span>View My Orders</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all ${
                  dark
                    ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA] hover:bg-[#2D3B56]"
                    : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50] hover:bg-[#EDF2F9]"
                }`}
              >
                Browse Shop
              </Link>
            </div>
          </div>
        )}

        {/* Loading State */}
        {sessionId && isLoading && (
          <div className="flex flex-col items-center py-6">
            <div className="relative mx-auto flex items-center justify-center w-20 h-20 mb-6">
              <div
                className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                  dark ? "bg-[#7895C5]" : "bg-[#202C50]"
                }`}
              />
              <div
                className={`relative flex items-center justify-center w-20 h-20 rounded-full border ${
                  dark
                    ? "bg-[#171E30] border-[#35435C] text-[#7895C5]"
                    : "bg-[#F7F9FC] border-[#D8E1EF] text-[#202C50]"
                }`}
              >
                <Loader2 className="w-10 h-10 animate-spin stroke-[2.2]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Verifying Payment
            </h1>
            <p
              className={`mt-2 text-sm sm:text-base max-w-md ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Please wait while we confirm your transaction and generate your order...
            </p>
          </div>
        )}

        {/* Error State */}
        {sessionId && !isLoading && isError && (
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-20 h-20 rounded-full border mb-6 ${
                dark
                  ? "bg-[#C04452]/10 border-[#C04452]/20 text-[#F08089] ring-8 ring-[#C04452]/5"
                  : "bg-red-50 border-red-200 text-[#C04452] ring-8 ring-red-500/5"
              }`}
            >
              <AlertCircle className="w-10 h-10 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Could Not Verify Order
            </h1>
            <p
              className={`mt-2 text-sm sm:text-base max-w-md ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              {error?.status === 401
                ? "Please log in to view your verified order details."
                : error?.data?.message || "There was a problem checking your payment status."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {error?.status === 401 ? (
                <Link
                  to="/login"
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${
                    dark
                      ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                      : "bg-[#202C50] text-white hover:bg-[#344F82]"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Account</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={checkStatus}
                  disabled={isFetching}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
                    dark
                      ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                      : "bg-[#202C50] text-white hover:bg-[#344F82]"
                  }`}
                >
                  <RotateCcw
                    className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                  />
                  <span>{isFetching ? "Checking..." : "Try Checking Again"}</span>
                </button>
              )}

              <Link
                to="/orders"
                className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border transition-all ${
                  dark
                    ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA] hover:bg-[#2D3B56]"
                    : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50] hover:bg-[#EDF2F9]"
                }`}
              >
                Go to Orders
              </Link>
            </div>
          </div>
        )}

        {/* Confirmed Order State */}
        {sessionId && !isLoading && !isError && data?.success && order && (
          <div className="flex flex-col items-center">
            {/* Animated Celebration Icon */}
            <div className="relative mx-auto flex items-center justify-center w-20 h-20 mb-6">
              <div
                className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
                  dark ? "bg-emerald-400" : "bg-emerald-500"
                }`}
              />
              <div
                className={`relative flex items-center justify-center w-20 h-20 rounded-full border transition-all ${
                  dark
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 ring-8 ring-emerald-500/10"
                    : "bg-emerald-50 border-emerald-200 text-emerald-600 ring-8 ring-emerald-500/10"
                }`}
              >
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              </div>
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  order.orderStatus === "CANCELLED"
                    ? "bg-amber-500"
                    : "bg-emerald-500 animate-pulse"
                }`}
              />
              <span
                className={`${
                  order.orderStatus === "CANCELLED"
                    ? "text-amber-500"
                    : dark
                    ? "text-emerald-400"
                    : "text-emerald-700"
                } font-semibold`}
              >
                {order.orderStatus === "CANCELLED"
                  ? "Order Cancelled"
                  : "Payment Successful"}
              </span>
            </div>

            {/* Headings */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {order.orderStatus === "CANCELLED"
                ? "Order Cancelled"
                : "Thank You for Your Order! 🎉"}
            </h1>
            <p
              className={`mt-2 text-sm sm:text-base max-w-md leading-relaxed ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              We've received your payment and are getting your order ready. A
              confirmation has been sent to your registered email.
            </p>

            {/* Receipt Summary Card */}
            <div
              className={`w-full rounded-2xl border p-4 sm:p-5 my-6 text-left transition-colors ${
                dark
                  ? "bg-[#171E30]/70 border-[#35435C]"
                  : "bg-[#F7F9FC] border-[#D8E1EF]"
              }`}
            >
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-inherit">
                <div>
                  <p
                    className={`text-xs uppercase tracking-wider font-semibold ${
                      dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                    }`}
                  >
                    Order Reference
                  </p>
                  <p
                    className={`font-mono text-sm sm:text-base font-bold mt-0.5 ${
                      dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                    }`}
                  >
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    dark
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {order.paymentDetails?.payment_status === "paid" ||
                  order.paymentDetails?.payment_status === "SUCCESS"
                    ? "Paid via Stripe"
                    : order.paymentDetails?.payment_status || "Paid"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3">
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Total Amount Paid
                </p>
                <p
                  className={`text-xl sm:text-2xl font-black ${
                    dark ? "text-[#7895C5]" : "text-[#202C50]"
                  }`}
                >
                  {formatPrice
                    ? formatPrice.format(Number(order.totalAmount || 0))
                    : `₹${Number(order.totalAmount || 0).toLocaleString(
                        "en-IN"
                      )}`}
                </p>
              </div>
            </div>

            {/* Trust Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left mb-8">
              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  dark
                    ? "bg-[#171E30]/50 border-[#35435C]"
                    : "bg-[#F7F9FC]/80 border-[#D8E1EF]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                    dark
                      ? "bg-[#202A40] text-[#7895C5]"
                      : "bg-white text-[#202C50]"
                  }`}
                >
                  <Package className="w-4 h-4" />
                </div>
                <p
                  className={`text-xs font-bold ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  Preparing Order
                </p>
                <p
                  className={`text-[11px] mt-0.5 leading-snug ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Getting packed with care
                </p>
              </div>

              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  dark
                    ? "bg-[#171E30]/50 border-[#35435C]"
                    : "bg-[#F7F9FC]/80 border-[#D8E1EF]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                    dark
                      ? "bg-[#202A40] text-[#7895C5]"
                      : "bg-white text-[#202C50]"
                  }`}
                >
                  <Truck className="w-4 h-4" />
                </div>
                <p
                  className={`text-xs font-bold ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  Fast Dispatch
                </p>
                <p
                  className={`text-[11px] mt-0.5 leading-snug ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Ships in 24-48 hours
                </p>
              </div>

              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  dark
                    ? "bg-[#171E30]/50 border-[#35435C]"
                    : "bg-[#F7F9FC]/80 border-[#D8E1EF]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                    dark
                      ? "bg-[#202A40] text-[#7895C5]"
                      : "bg-white text-[#202C50]"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <p
                  className={`text-xs font-bold ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  Order Updates
                </p>
                <p
                  className={`text-[11px] mt-0.5 leading-snug ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Tracking sent to email
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full">
              <Link
                to={`/orders/${order._id}`}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] ${
                  dark
                    ? "bg-[#7895C5] hover:bg-[#9BB2D8] text-[#171E30] shadow-lg shadow-[#7895C5]/15"
                    : "bg-[#202C50] hover:bg-[#344F82] text-white shadow-lg shadow-[#202C50]/20"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>View Order Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/shop"
                className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border transition-all duration-200 hover:opacity-90 active:scale-[0.98] ${
                  dark
                    ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA] hover:bg-[#2D3B56]"
                    : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50] hover:bg-[#EDF2F9]"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        )}

        {/* Polling / Pending Confirmation Fallback */}
        {sessionId &&
          !isLoading &&
          !isError &&
          (!data?.success || !order) && (
            <div className="flex flex-col items-center">
              <div className="relative mx-auto flex items-center justify-center w-20 h-20 mb-6">
                <div
                  className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                    dark ? "bg-[#7895C5]" : "bg-[#202C50]"
                  }`}
                />
                <div
                  className={`relative flex items-center justify-center w-20 h-20 rounded-full border ${
                    dark
                      ? "bg-[#171E30] border-[#35435C] text-[#7895C5]"
                      : "bg-[#F7F9FC] border-[#D8E1EF] text-[#202C50]"
                  }`}
                >
                  <Loader2 className="w-10 h-10 animate-spin stroke-[2.2]" />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Confirming Your Order
              </h1>
              <p
                className={`mt-2 text-sm sm:text-base max-w-md ${
                  dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                }`}
              >
                Payment confirmation is still processing with Stripe. We are checking
                automatically.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={checkStatus}
                  disabled={isFetching}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
                    dark
                      ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                      : "bg-[#202C50] text-white hover:bg-[#344F82]"
                  }`}
                >
                  <RotateCcw
                    className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                  />
                  <span>
                    {isFetching ? "Checking..." : "Check Status Now"}
                  </span>
                </button>

                <Link
                  to="/orders"
                  className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border transition-all ${
                    dark
                      ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA] hover:bg-[#2D3B56]"
                      : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50] hover:bg-[#EDF2F9]"
                  }`}
                >
                  Go to Orders
                </Link>
              </div>

              <p
                className={`mt-4 text-xs ${
                  dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                }`}
              >
                {pollingEnabled
                  ? "Auto-refreshing status every few seconds..."
                  : "Confirmation is taking a bit longer. You can check again manually or visit your orders page."}
              </p>
            </div>
          )}
      </div>
    </main>
  );
};

export default PaymentSuccess;
