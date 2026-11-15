import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  const { dark } = UseGlob();

  const linkColor = dark
    ? "text-[#AAB8D0] hover:text-[#7895C5]"
    : "text-[#64718A] hover:text-[#344F82]";

  const headingColor = dark ? "text-[#EAF0FA]" : "text-[#202C50]";

  const mutedColor = dark ? "text-[#AAB8D0]" : "text-[#64718A]";

  const paymentBadge = dark
    ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
    : "border-[#D8E1EF] bg-white text-[#202C50]";

  return (
    <footer
      className={`mt-16 border-t transition-colors duration-200 ${
        dark
          ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA]"
          : "border-[#D8E1EF] bg-white text-[#202C50]"
      }`}
    >
      {/* Main Navigation Section */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center text-2xl font-black italic tracking-tight"
            >
              <span className={dark ? "text-[#7895C5]" : "text-[#202C50]"}>
                Nova
              </span>
              <span className="text-[#344F82] dark:text-[#7895C5]">.</span>
            </Link>

            <span
              className={`mt-0.5 block text-[10px] font-semibold tracking-wider ${mutedColor}`}
            >
              Cobalt{" "}
              <span className="font-bold text-[#344F82] dark:text-[#7895C5]">
                Cloud
              </span>
            </span>

            <p
              className={`mt-3 max-w-sm text-xs leading-relaxed sm:text-sm ${mutedColor}`}
            >
              Your premium destination for curated essentials, modern
              collections, and thoughtfully designed products crafted for
              everyday life.
            </p>

            <div className="mt-5 space-y-2 text-xs">
              <div className={`flex items-center gap-2 ${mutedColor}`}>
                <Mail
                  size={14}
                  className={dark ? "text-[#7895C5]" : "text-[#344F82]"}
                />
                <span>support@novastore.com</span>
              </div>

              <div className={`flex items-center gap-2 ${mutedColor}`}>
                <Phone
                  size={14}
                  className={dark ? "text-[#7895C5]" : "text-[#344F82]"}
                />
                <span>+91 1800 123 4567 (Toll-Free)</span>
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h3
              className={`text-xs font-bold uppercase tracking-wider ${headingColor}`}
            >
              Explore
            </h3>

            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/shop" className={`transition-colors ${linkColor}`}>
                  All Products
                </Link>
              </li>

              <li>
                <Link to="/shop" className={`transition-colors ${linkColor}`}>
                  Electronics & Tech
                </Link>
              </li>

              <li>
                <Link to="/shop" className={`transition-colors ${linkColor}`}>
                  Fashion & Style
                </Link>
              </li>

              <li>
                <Link to="/shop" className={`transition-colors ${linkColor}`}>
                  Featured Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Links */}
          <div>
            <h3
              className={`text-xs font-bold uppercase tracking-wider ${headingColor}`}
            >
              Account
            </h3>

            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  to="/orders"
                  className={`transition-colors ${linkColor}`}
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className={`transition-colors ${linkColor}`}
                >
                  Saved Wishlist
                </Link>
              </li>

              <li>
                <Link to="/cart" className={`transition-colors ${linkColor}`}>
                  Shopping Bag
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className={`transition-colors ${linkColor}`}
                >
                  Track Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust Highlights */}
          <div>
            <h3
              className={`text-xs font-bold uppercase tracking-wider ${headingColor}`}
            >
              Security
            </h3>

            <p className={`mt-4 text-xs leading-relaxed ${mutedColor}`}>
              Encrypted 256-bit SSL checkout ensuring your personal information
              and transactions remain completely secure.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className={`border-t transition-colors ${
          dark
            ? "border-[#35435C] bg-[#171E30]"
            : "border-[#D8E1EF] bg-[#F7F9FC]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <p className={`text-xs ${mutedColor}`}>
            © {new Date().getFullYear()}{" "}
            <span className={`font-bold ${headingColor}`}>Nova Store.</span>{" "}
            All rights reserved.
          </p>

          {/* Secure Payment Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className={`mr-1 text-[11px] font-semibold ${mutedColor}`}>
              100% Safe Payments:
            </span>

            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${paymentBadge}`}
            >
              VISA
            </span>

            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${paymentBadge}`}
            >
              Mastercard
            </span>

            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${paymentBadge}`}
            >
              UPI
            </span>

            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${paymentBadge}`}
            >
              RuPay
            </span>

            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold ${
                dark
                  ? "border-[#7895C5]/40 bg-[#7895C5]/15 text-[#7895C5]"
                  : "border-[#202C50]/30 bg-[#202C50]/10 text-[#344F82]"
              }`}
            >
              Stripe ⚡
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;