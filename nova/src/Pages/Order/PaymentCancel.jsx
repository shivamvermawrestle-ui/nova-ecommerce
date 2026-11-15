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

  const pageBg = dark ? "bg-[#171E30]" : "bg-[#F7F9FC]";
  const cardStyle = dark
    ? "border-[#35435C] bg-[#202A40] shadow-black/40 text-[#EAF0FA]"
    : "border-[#D8E1EF] bg-white shadow-[#202C50]/5 text-[#202C50]";

  const textPrimary = dark ? "text-[#EAF0FA]" : "text-[#202C50]";
  const textSecondary = dark ? "text-[#AAB8D0]" : "text-[#64718A]";

  const warningStyle = dark
    ? "bg-[#E6B66F]/10 border-[#E6B66F]/20 text-[#E6B66F]"
    : "bg-[#A66A22]/10 border-[#A66A22]/20 text-[#A66A22]";

  const warningDot = dark ? "bg-[#E6B66F]" : "bg-[#A66A22]";

  const featureCard = dark
    ? "bg-[#171E30]/60 border-[#35435C]"
    : "bg-[#F7F9FC] border-[#D8E1EF]";

  const featureIcon = dark
    ? "bg-[#202A40] text-[#7895C5]"
    : "bg-white text-[#344F82]";

  const primaryButton = dark
    ? "bg-[#7895C5] hover:bg-[#9BB2D8] text-[#171E30] shadow-[#7895C5]/15"
    : "bg-[#202C50] hover:bg-[#344F82] text-white shadow-[#202C50]/20";

  const secondaryButton = dark
    ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA] hover:bg-[#2D3B56]"
    : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50] hover:bg-[#EDF2F9]";

  return (
    <main
      className={`min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 transition-colors duration-300 ${pageBg}`}
    >
      <div
        className={`w-full max-w-xl rounded-3xl border p-6 sm:p-10 text-center transition-all duration-300 shadow-xl ${cardStyle}`}
      >
        {/* Animated Icon */}
        <div className="relative mx-auto flex items-center justify-center w-20 h-20 mb-6">
          <div
            className={`absolute inset-0 rounded-full animate-ping opacity-20 ${warningDot}`}
          />

          <div
            className={`relative flex items-center justify-center w-20 h-20 rounded-full border ring-8 ring-[#E6B66F]/5 transition-all ${warningStyle}`}
          >
            <AlertTriangle className="w-10 h-10 stroke-[2.2]" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3">
          <span
            className={`inline-block w-2 h-2 rounded-full animate-pulse ${warningDot}`}
          />

          <span className={dark ? "text-[#E6B66F]" : "text-[#A66A22]"}>
            Checkout Cancelled
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Your Cart is Still Saved
        </h1>

        <p
          className={`mt-2.5 text-sm sm:text-base max-w-md mx-auto leading-relaxed ${textSecondary}`}
        >
          Your payment was not processed and no money was deducted. You can
          review your cart and resume checkout whenever you're ready.
        </p>

        {/* Reassurance Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-8 text-left">
          <div
            className={`p-3.5 rounded-2xl border transition-colors ${featureCard}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${featureIcon}`}
            >
              <ShoppingCart className="w-4 h-4" />
            </div>

            <p className={`text-xs font-bold ${textPrimary}`}>Cart Safe</p>

            <p className={`text-[11px] mt-0.5 leading-snug ${textSecondary}`}>
              All items & quantities stay intact
            </p>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-colors ${featureCard}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${featureIcon}`}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>

            <p className={`text-xs font-bold ${textPrimary}`}>Zero Charges</p>

            <p className={`text-[11px] mt-0.5 leading-snug ${textSecondary}`}>
              No funds debited from account
            </p>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-colors ${featureCard}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${featureIcon}`}
            >
              <RotateCcw className="w-4 h-4" />
            </div>

            <p className={`text-xs font-bold ${textPrimary}`}>Instant Retry</p>

            <p className={`text-[11px] mt-0.5 leading-snug ${textSecondary}`}>
              Resume checkout in 1-click
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Link
            to="/cart"
            className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] shadow-lg ${primaryButton}`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Return to Cart</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/shop"
            className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border transition-all duration-200 hover:opacity-90 active:scale-[0.98] ${secondaryButton}`}
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
