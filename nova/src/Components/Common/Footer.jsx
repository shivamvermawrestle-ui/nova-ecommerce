import { Link } from "react-router-dom";
import { useState } from "react";
import { UseGlob } from "../../Context/GlobalContext";
import {
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  const { dark } = UseGlob();

  return (
    <footer
      className={`mt-16 border-t transition-colors duration-200 ${
        dark ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA]" : "border-[#D8E1EF] bg-[#FFFFFF] text-[#202C50]"
      }`}
    >
      {/* Main Navigation Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center text-2xl font-black italic tracking-tight">
              <span className={dark ? "text-[#7895C5]" : "text-[#202C50]"}>Nova</span>
              <span className="text-[#3568A8] dark:text-[#8CB4EC]">.</span>
            </Link>
            <span
              className={`block text-[10px] font-semibold tracking-wider mt-0.5 ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Cobalt <span className="text-[#3568A8] dark:text-[#8CB4EC] font-bold">Cloud</span>
            </span>

            <p
              className={`mt-3 max-w-sm text-xs sm:text-sm leading-relaxed ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Your premium destination for curated essentials, modern collections, and thoughtfully designed products crafted for everyday life.
            </p>

            <div className="mt-5 space-y-2 text-xs">
              <div className={`flex items-center gap-2 ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
                <Mail size={14} className={dark ? "text-[#7895C5]" : "text-[#202C50]"} />
                <span>support@novastore.com</span>
              </div>
              <div className={`flex items-center gap-2 ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
                <Phone size={14} className={dark ? "text-[#7895C5]" : "text-[#202C50]"} />
                <span>+91 1800 123 4567 (Toll-Free)</span>
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  to="/shop"
                  className={`transition-colors ${
                    dark ? "text-[#AAB8D0] hover:text-[#7895C5]" : "text-[#64718A] hover:text-[#202C50]"
                  }`}
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className={`transition-colors ${
                    dark ? "text-[#AAB8D0] hover:text-[#7895C5]" : "text-[#64718A] hover:text-[#202C50]"
                  }`}
                >
                  Electronics & Tech
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className={`transition-colors ${
                    dark ? "text-[#AAB8D0] hover:text-[#7895C5]" : "text-[#64718A] hover:text-[#202C50]"
                  }`}
                >
                  Fashion & Style
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className={`transition-colors ${
                    dark ? "text-[#AAB8D0] hover:text-[#7895C5]" : "text-[#64718A] hover:text-[#202C50]"
                  }`}
                >
                  Featured Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">Account</h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  to="/orders"
                  className={`transition-colors ${
                    dark ? "text-[#AAB8D0] hover:text-[#7895C5]" : "text-[#64718A] hover:text-[#202C50]"
                  }`}
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className={`transition-colors ${
                    dark ? "text-[#AAB8D0] hover:text-[#7895C5]" : "text-[#64718A] hover:text-[#202C50]"
                  }`}
                >
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className={`transition-colors ${
                    dark ? "text-[#AAB8D0] hover:text-[#7895C5]" : "text-[#64718A] hover:text-[#202C50]"
                  }`}
                >
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className={`transition-colors ${
                    dark ? "text-[#AAB8D0] hover:text-[#7895C5]" : "text-[#64718A] hover:text-[#202C50]"
                  }`}
                >
                  Track Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust Highlights */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">Security</h3>
            <p className={`mt-4 text-xs leading-relaxed ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
              Encrypted 256-bit SSL checkout ensuring your personal information and transactions remain completely secure.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Verified Payment Badges */}
      <div
        className={`border-t transition-colors ${
          dark ? "border-[#35435C] bg-[#171E30]" : "border-[#D8E1EF] bg-[#F7F9FC]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 py-6 sm:flex-row">
          <p className={`text-xs ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
            © {new Date().getFullYear()} <span className="font-bold">Nova Store.</span> All rights reserved.
          </p>

          {/* Secure Payment Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
            <span
              className={`text-[11px] font-semibold mr-1 ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              100% Safe Payments:
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                dark
                  ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
                  : "border-[#D8E1EF] bg-white text-[#202C50]"
              }`}
            >
              VISA
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                dark
                  ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
                  : "border-[#D8E1EF] bg-white text-[#202C50]"
              }`}
            >
              Mastercard
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                dark
                  ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
                  : "border-[#D8E1EF] bg-white text-[#202C50]"
              }`}
            >
              UPI
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                dark
                  ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
                  : "border-[#D8E1EF] bg-white text-[#202C50]"
              }`}
            >
              RuPay
            </span>
            <span className="rounded-md border border-[#202C50]/30 bg-[#202C50]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#202C50] dark:border-[#7895C5]/40 dark:bg-[#7895C5]/15 dark:text-[#7895C5]">
              Stripe ⚡
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
