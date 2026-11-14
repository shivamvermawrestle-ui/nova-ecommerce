import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import {
  productsApi,
  useGetCartCountQuery,
  useGetCurrentUserQuery,
  useGetWishlistQuery,
  useLogoutMutation,
} from "../../services/productsApi";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  Package,
  LogOut,
  ShieldCheck,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import StoreBrowseBar from "./StoreBrowseBar";
import StoreSearchForm from "./StoreSearchForm";

const Navbar = () => {
  const { dark, setDark, navigate } = UseGlob();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: user, isLoading: checkingUser } = useGetCurrentUserQuery();
  const [logout, { isLoading: isLogginOut, error: logoutError }] =
    useLogoutMutation();

  const { data: cartCount = 0 } = useGetCartCountQuery(undefined, {
    skip: !user,
  });

  const { data: wishlist = [] } = useGetWishlistQuery(undefined, {
    skip: !user,
  });
  const wishlistCount = wishlist.filter((item) => item.productId).length;

  const closeMenu = () => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(productsApi.util.resetApiState());
      closeMenu();
      navigate("/");
    } catch {
      // handled by RTK error state
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        dark ? "bg-[#171E30]" : "bg-[#FFFFFF]"
      }`}
    >
      <header
        className={`border-b transition-colors duration-200 ${
          dark
            ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA]"
            : "border-[#D8E1EF] bg-[#FFFFFF] text-[#202C50]"
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          {/* Main Navigation Row */}
          <div className="flex items-center justify-between gap-3 py-2.5 sm:gap-6">
            {/* Brand Logo */}
            <Link to="/" className="flex shrink-0 flex-col leading-none">
              <div className="flex items-center text-2xl font-black italic tracking-tight">
                <span className={dark ? "text-[#7895C5]" : "text-[#202C50]"}>
                  Nova
                </span>
                <span className="text-[#3568A8] dark:text-[#8CB4EC]">.</span>
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wider flex items-center gap-0.5 ${
                  dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                }`}
              >
                Cobalt <span className="text-[#3568A8] dark:text-[#8CB4EC] font-bold">Cloud</span>
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden min-w-0 flex-1 lg:block max-w-2xl">
              <StoreSearchForm />
            </div>

            {/* Desktop Account, Wishlist & Cart Actions */}
            <div className="hidden shrink-0 items-center gap-5 lg:flex">
              {/* User Account / Login Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {checkingUser ? (
                  <span className="text-xs font-medium text-[#8A96AA] dark:text-[#8190AA]">
                    Checking...
                  </span>
                ) : user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                        dark
                          ? "text-[#EAF0FA] hover:bg-[#202A40]"
                          : "text-[#202C50] hover:bg-[#EDF2F9]"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          dark
                            ? "bg-[#202A40] text-[#7895C5] border border-[#35435C]"
                            : "bg-[#DFE7F3] text-[#202C50] border border-[#D8E1EF]"
                        }`}
                      >
                        {user.name ? (
                          user.name.charAt(0).toUpperCase()
                        ) : (
                          <User size={14} />
                        )}
                      </div>
                      <span className="max-w-28 truncate">{user.name}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          userDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {userDropdownOpen && (
                      <div
                        className={`absolute right-0 top-11 z-50 w-56 rounded-xl border p-2 shadow-xl transition-all ${
                          dark
                            ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
                            : "border-[#D8E1EF] bg-[#FFFFFF] text-[#202C50]"
                        }`}
                      >
                        <div
                          className={`border-b px-3 py-2 text-xs font-medium ${
                            dark
                              ? "border-[#35435C] text-[#AAB8D0]"
                              : "border-[#D8E1EF] text-[#64718A]"
                          }`}
                        >
                          Signed in as{" "}
                          <span
                            className={`font-semibold ${
                              dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                            }`}
                          >
                            {user.email || user.name}
                          </span>
                        </div>

                        {user.role === "ADMIN" && (
                          <Link
                            to="/dashboard"
                            onClick={closeMenu}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                              dark
                                ? "text-[#7895C5] hover:bg-[#171E30]"
                                : "text-[#202C50] hover:bg-[#EDF2F9]"
                            }`}
                          >
                            <ShieldCheck size={16} />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <Link
                          to="/orders"
                          onClick={closeMenu}
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                            dark
                              ? "hover:bg-[#171E30] text-[#EAF0FA]"
                              : "hover:bg-[#EDF2F9] text-[#202C50]"
                          }`}
                        >
                          <Package
                            size={16}
                            className={
                              dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                            }
                          />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={closeMenu}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                            dark
                              ? "hover:bg-[#171E30] text-[#EAF0FA]"
                              : "hover:bg-[#EDF2F9] text-[#202C50]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart
                              size={16}
                              className={
                                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                              }
                            />
                            <span>Wishlist</span>
                          </div>
                          {wishlistCount > 0 && (
                            <span className="rounded-full bg-[#DFE7F3] px-2 py-0.5 text-xs font-bold text-[#202C50] dark:bg-[#34415B] dark:text-[#7895C5]">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>

                        <div
                          className={`my-1 h-px ${
                            dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
                          }`}
                        />

                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={isLogginOut}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[#C04452] dark:text-[#F08089] transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-50"
                        >
                          <LogOut size={16} />
                          <span>
                            {isLogginOut ? "Logging out..." : "Logout"}
                          </span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-1.5 text-sm font-semibold transition-all ${
                      dark
                        ? "border-[#7895C5] bg-[#202A40] text-[#7895C5] hover:bg-[#2D3B56]"
                        : "border-[#202C50] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
                    }`}
                  >
                    <User size={16} />
                    <span>Login</span>
                    <ChevronDown size={14} />
                  </Link>
                )}
              </div>

              {/* Wishlist Quick Link */}
              <Link
                to="/wishlist"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  dark
                    ? "text-[#EAF0FA] hover:text-[#7895C5]"
                    : "text-[#202C50] hover:text-[#344F82]"
                }`}
              >
                <div className="relative">
                  <Heart size={18} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#C34D68] text-[10px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </Link>

              {/* Cart Button */}
              <Link
                to="/cart"
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  dark
                    ? "text-[#EAF0FA] hover:bg-[#202A40]"
                    : "text-[#202C50] hover:bg-[#EDF2F9]"
                }`}
              >
                <div className="relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#C34D68] text-[10px] font-black text-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={() => setDark(!dark)}
                title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-all ${
                  dark
                    ? "border-[#35435C] bg-[#202A40] text-[#7895C5] hover:bg-[#2D3B56]"
                    : "border-[#D8E1EF] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
                }`}
              >
                {dark ? (
                  <>
                    <Sun size={13} className="text-[#E6B66F] fill-[#E6B66F]" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon size={13} className="text-[#202C50]" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Header Right Controls: Theme Toggle, Cart & Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setDark(!dark)}
                className={`rounded-lg p-2 transition-colors ${
                  dark
                    ? "text-[#7895C5] hover:bg-[#202A40]"
                    : "text-[#202C50] hover:bg-[#EDF2F9]"
                }`}
                title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {dark ? (
                  <Sun size={20} className="text-[#E6B66F] fill-[#E6B66F]" />
                ) : (
                  <Moon size={20} />
                )}
              </button>

              <Link
                to="/cart"
                onClick={closeMenu}
                className={`relative rounded-lg p-2 transition-colors ${
                  dark
                    ? "text-[#EAF0FA] hover:bg-[#202A40]"
                    : "text-[#202C50] hover:bg-[#EDF2F9]"
                }`}
              >
                <ShoppingCart size={21} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#C34D68] text-[10px] font-black text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className={`rounded-lg p-2 transition-colors ${
                  dark
                    ? "text-[#EAF0FA] hover:bg-[#202A40]"
                    : "text-[#202C50] hover:bg-[#EDF2F9]"
                }`}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Full Width) */}
          <div className="pb-2.5 lg:hidden">
            <StoreSearchForm />
          </div>

          {/* Mobile Dropdown Drawer */}
          {menuOpen && (
            <div
              className={`rounded-2xl border p-4 shadow-2xl mb-3 flex flex-col gap-3 lg:hidden ${
                dark
                  ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
                  : "border-[#D8E1EF] bg-[#FFFFFF] text-[#202C50]"
              }`}
            >
              {/* User Section on Mobile */}
              {checkingUser ? (
                <p className="text-xs text-[#8A96AA] dark:text-[#8190AA]">
                  Checking account...
                </p>
              ) : user ? (
                <div
                  className={`border-b pb-3 ${
                    dark ? "border-[#35435C]" : "border-[#D8E1EF]"
                  }`}
                >
                  <p className="text-xs text-[#64718A] dark:text-[#AAB8D0]">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold truncate">
                    {user.name} ({user.email})
                  </p>
                  {user.role === "ADMIN" && (
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#202C50] px-3 py-1.5 text-xs font-semibold text-white dark:bg-[#7895C5] dark:text-[#171E30]"
                    >
                      <ShieldCheck size={14} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-lg bg-[#202C50] py-2 text-center text-sm font-bold text-white dark:bg-[#7895C5] dark:text-[#171E30]"
                >
                  Login to your account
                </Link>
              )}

              {/* Nav links */}
              <nav className="flex flex-col gap-2 font-medium text-sm">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    dark ? "hover:bg-[#171E30]" : "hover:bg-[#EDF2F9]"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={closeMenu}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    dark ? "hover:bg-[#171E30]" : "hover:bg-[#EDF2F9]"
                  }`}
                >
                  Shop
                </Link>

                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    dark ? "hover:bg-[#171E30]" : "hover:bg-[#EDF2F9]"
                  }`}
                >
                  <span>My Orders</span>
                  <Package size={16} />
                </Link>
                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    dark ? "hover:bg-[#171E30]" : "hover:bg-[#EDF2F9]"
                  }`}
                >
                  <span>Wishlist</span>
                  <span className="text-xs font-bold text-[#202C50] dark:text-[#7895C5]">
                    ({wishlistCount})
                  </span>
                </Link>
              </nav>

              {user && (
                <div
                  className={`border-t pt-3 ${
                    dark ? "border-[#35435C]" : "border-[#D8E1EF]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLogginOut}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#C04452] bg-rose-50 py-2 text-sm font-semibold text-[#C04452] dark:bg-rose-950/40 dark:text-[#F08089] dark:border-[#F08089]/30"
                  >
                    <LogOut size={16} />
                    <span>{isLogginOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Row 3: Category Navigation Bar */}
      <StoreBrowseBar />

      {logoutError && (
        <div className="bg-[#C04452] py-1 text-center text-xs text-white">
          Logout failed. Please try again.
        </div>
      )}
    </div>
  );
};

export default Navbar;
