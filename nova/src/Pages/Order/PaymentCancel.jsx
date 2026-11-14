import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import {
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

const PaymentCancel = () => {
  const { dark } = UseGlob();

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
        {/* Animated Icon with subtle pulse */}
        <div className="relative mx-auto flex items-center justify-center w-20 h-20 mb-6">
          <div
            className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
              dark ? "bg-amber-400" : "bg-amber-500"
            }`}
          />
          <div
            className={`relative flex items-center justify-center w-20 h-20 rounded-full border transition-all ${
              dark
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400 ring-8 ring-amber-500/5"
                : "bg-amber-50 border-amber-200 text-amber-600 ring-8 ring-amber-500/5"
            }`}
          >
            <AlertTriangle className="w-10 h-10 stroke-[2.2]" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3">
          <span
            className={`inline-block w-2 h-2 rounded-full animate-pulse ${
              dark ? "bg-amber-400" : "bg-amber-500"
            }`}
          />
          <span
            className={`${
              dark ? "text-amber-400" : "text-amber-700"
            } font-semibold`}
          >
            Checkout Cancelled
          </span>
        </div>

        {/* Main Headings */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Your Cart is Still Saved
        </h1>
        <p
          className={`mt-2.5 text-sm sm:text-base max-w-md mx-auto leading-relaxed ${
            dark ? "text-[#AAB8D0]" : "text-[#64718A]"
          }`}
        >
          Your payment was not processed and no money was deducted. You can
          review your cart and resume checkout whenever you're ready.
        </p>

        {/* Reassurance Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-8 text-left">
          <div
            className={`p-3.5 rounded-2xl border transition-colors ${
              dark
                ? "bg-[#171E30]/60 border-[#35435C]"
                : "bg-[#F7F9FC] border-[#D8E1EF]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                dark
                  ? "bg-[#202A40] text-[#7895C5]"
                  : "bg-white text-[#202C50]"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
            </div>
            <p
              className={`text-xs font-bold ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              Cart Safe
            </p>
            <p
              className={`text-[11px] mt-0.5 leading-snug ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              All items & quantities stay intact
            </p>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-colors ${
              dark
                ? "bg-[#171E30]/60 border-[#35435C]"
                : "bg-[#F7F9FC] border-[#D8E1EF]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                dark
                  ? "bg-[#202A40] text-[#7895C5]"
                  : "bg-white text-[#202C50]"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p
              className={`text-xs font-bold ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              Zero Charges
            </p>
            <p
              className={`text-[11px] mt-0.5 leading-snug ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              No funds debited from account
            </p>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-colors ${
              dark
                ? "bg-[#171E30]/60 border-[#35435C]"
                : "bg-[#F7F9FC] border-[#D8E1EF]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                dark
                  ? "bg-[#202A40] text-[#7895C5]"
                  : "bg-white text-[#202C50]"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
            </div>
            <p
              className={`text-xs font-bold ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              Instant Retry
            </p>
            <p
              className={`text-[11px] mt-0.5 leading-snug ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Resume checkout in 1-click
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Link
            to="/cart"
            className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] ${
              dark
                ? "bg-[#7895C5] hover:bg-[#9BB2D8] text-[#171E30] shadow-lg shadow-[#7895C5]/15"
                : "bg-[#202C50] hover:bg-[#344F82] text-white shadow-lg shadow-[#202C50]/20"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Return to Cart</span>
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
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Help Note */}
        <div
          className={`mt-8 pt-6 border-t flex items-center justify-center gap-2 text-xs ${
            dark
              ? "border-[#35435C]/60 text-[#AAB8D0]"
              : "border-[#D8E1EF] text-[#64718A]"
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>
            Need help? Try an alternate payment method or contact support.
          </span>
        </div>
      </div>
    </main>
  );
};

export default PaymentCancel;
