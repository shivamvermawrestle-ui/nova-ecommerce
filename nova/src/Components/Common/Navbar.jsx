
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

  const { data: user, isLoading: checkingUser } =
    useGetCurrentUserQuery();

  const [logout, { isLoading: isLogginOut, error: logoutError }] =
    useLogoutMutation();

  const { data: cartCount = 0 } = useGetCartCountQuery(undefined, {
    skip: !user,
  });

  const { data: wishlist = [] } = useGetWishlistQuery(undefined, {
    skip: !user,
  });

  const wishlistCount = wishlist.filter(
    (item) => item.productId
  ).length;

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme colors
  const hoverBg = dark
    ? "hover:bg-[#171E30]"
    : "hover:bg-[#F7F9FC]";

  const navHoverBg = dark
    ? "hover:bg-[#171E30]"
    : "hover:bg-[#EDF2F9]";

  const mutedText = dark
    ? "text-[#AAB8D0]"
    : "text-[#64718A]";

  const mainText = dark
    ? "text-[#EAF0FA]"
    : "text-[#202C50]";

  const logoAccent = dark
    ? "text-[#7895C5]"
    : "text-[#344F82]";

  const adminButton = dark
    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
    : "bg-[#202C50] text-white hover:bg-[#344F82]";

  // Consistent Logout button colors
  const logoutButton = dark
    ? "border border-[#F08089]/40 bg-[#352735] text-[#F08089] hover:bg-[#49303A] hover:border-[#F08089]"
    : "border border-[#F3C5C9] bg-[#FFF1F2] text-[#C04452] hover:bg-[#FFE1E4] hover:border-[#C04452]";

  return (
    <div
      className={`sticky top-0 z-100 transition-colors duration-200 ${
        dark ? "bg-[#171E30]" : "bg-white"
      }`}
    >
      <header
        className={`border-b transition-colors duration-200 ${
          dark
            ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA]"
            : "border-[#D8E1EF] bg-white text-[#202C50]"
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
                <span className={logoAccent}>.</span>
              </div>

              <span
                className={`flex items-center gap-0.5 text-[10px] font-semibold tracking-wider ${mutedText}`}
              >
                Cobalt <span className={`font-bold ${logoAccent}`}>Cloud</span>
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden min-w-0 max-w-2xl flex-1 lg:block">
              <StoreSearchForm />
            </div>

            {/* Desktop Actions */}
            <div className="hidden shrink-0 items-center gap-5 lg:flex">
              {/* User Account */}
              <div className="relative" ref={dropdownRef}>
                {checkingUser ? (
                  <span className={`text-xs font-medium ${mutedText}`}>
                    Checking...
                  </span>
                ) : user ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setUserDropdownOpen(!userDropdownOpen)
                      }
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                        dark
                          ? "text-[#EAF0FA] hover:bg-[#202A40]"
                          : "text-[#202C50] hover:bg-[#F7F9FC]"
                      }`}
                    >
                      {/* Desktop user avatar */}
                      <div className={`h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full border overflow-hidden ${
                        dark
                          ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA]"
                          : "border-[#D8E1EF] bg-gray-100 text-[#202C50]"
                      }`}>
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={user.name || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : user.name ? (
                          <span className="text-xs font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <User size={16} />
                        )}
                      </div>

                      <span className="max-w-28 truncate">
                        {user.name}
                      </span>

                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          userDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Desktop Dropdown */}
                    {userDropdownOpen && (
                      <div
                        className={`absolute right-0 top-11 z-50 w-56 rounded-xl border p-2 shadow-xl transition-all ${
                          dark
                            ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
                            : "border-[#D8E1EF] bg-white text-[#202C50]"
                        }`}
                      >
                        <div
                          className={`border-b px-3 py-2.5 text-xs font-medium ${
                            dark
                              ? "border-[#35435C] text-[#AAB8D0]"
                              : "border-[#D8E1EF] text-[#64718A]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full border overflow-hidden ${
                              dark
                                ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA]"
                                : "border-[#D8E1EF] bg-gray-100 text-[#202C50]"
                            }`}>
                              {user.profilePic ? (
                                <img
                                  src={user.profilePic}
                                  alt={user.name || "User"}
                                  className="h-full w-full object-cover"
                                />
                              ) : user.name ? (
                                <span className="text-xs font-bold">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              ) : (
                                <User size={14} />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] opacity-75">Signed in as</p>
                              <p className={`truncate font-semibold ${mainText}`}>
                                {user.name || user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {user.role === "ADMIN" && (
                          <Link
                            to="/dashboard"
                            onClick={closeMenu}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                              dark
                                ? "text-[#7895C5] hover:bg-[#171E30]"
                                : "text-[#344F82] hover:bg-[#F7F9FC]"
                            }`}
                          >
                            <ShieldCheck size={16} />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <Link
                          to="/orders"
                          onClick={closeMenu}
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${hoverBg} ${mainText}`}
                        >
                          <Package size={16} className={mutedText} />
                          <span>My Orders</span>
                        </Link>

                       

                        <div
                          className={`my-1 h-px ${
                            dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
                          }`}
                        />

                        {/* FIXED DESKTOP LOGOUT */}
                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={isLogginOut}
                          className={`flex w-full items-center  gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${logoutButton}`}
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
                        : "border-[#D8E1EF] bg-white text-[#202C50] hover:border-[#344F82] hover:bg-[#F7F9FC]"
                    }`}
                  >
                    <User size={16} />
                    <span>Login</span>
                    <ChevronDown size={14} />
                  </Link>
                )}
              </div>

              {/* Wishlist */}
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
                    <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C04452] text-[10px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  dark
                    ? "text-[#EAF0FA] hover:bg-[#202A40]"
                    : "text-[#202C50] hover:bg-[#F7F9FC]"
                }`}
              >
                <div className="relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#C04452] text-[10px] font-black text-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={() => setDark(!dark)}
                title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-all ${
                  dark
                    ? "border-[#35435C] bg-[#202A40] text-[#7895C5] hover:bg-[#2D3B56]"
                    : "border-[#D8E1EF] bg-white text-[#344F82] hover:bg-[#F7F9FC]"
                }`}
              >
                {dark ? (
                  <>
                    <Sun size={13} className="fill-[#E6B66F] text-[#E6B66F]" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon size={13} />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                type="button"
                onClick={() => setDark(!dark)}
                className={`rounded-lg p-2 transition-colors ${
                  dark
                    ? "text-[#7895C5] hover:bg-[#202A40]"
                    : "text-[#344F82] hover:bg-[#F7F9FC]"
                }`}
                title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {dark ? (
                  <Sun size={20} className="fill-[#E6B66F] text-[#E6B66F]" />
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
                    : "text-[#202C50] hover:bg-[#F7F9FC]"
                }`}
              >
                <ShoppingCart size={21} />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#C04452] text-[10px] font-black text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Profile Pic button */}
              {user && (
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle user menu"
                  className="rounded-full p-0.5 transition-transform active:scale-95"
                >
                  <div
                    className={`h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full border overflow-hidden ${
                      dark
                        ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA]"
                        : "border-[#D8E1EF] bg-gray-100 text-[#202C50]"
                    }`}
                  >
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : user.name ? (
                      <span className="text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                </button>
              )}

              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className={`rounded-lg p-2 transition-colors ${
                  dark
                    ? "text-[#EAF0FA] hover:bg-[#202A40]"
                    : "text-[#202C50] hover:bg-[#F7F9FC]"
                }`}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="pb-2.5 lg:hidden">
            <StoreSearchForm />
          </div>

          {/* Mobile Drawer */}
          {menuOpen && (
            <div
              className={`mb-3 flex flex-col gap-3 rounded-2xl border p-4 shadow-2xl lg:hidden ${
                dark
                  ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
                  : "border-[#D8E1EF] bg-white text-[#202C50]"
              }`}
            >
              {/* Mobile User Section */}
              {checkingUser ? (
                <p className={`text-xs ${mutedText}`}>
                  Checking account...
                </p>
              ) : user ? (
                <div
                  className={`flex items-center gap-3 border-b pb-3 ${
                    dark ? "border-[#35435C]" : "border-[#D8E1EF]"
                  }`}
                >
                  {/* Mobile Drawer Profile Avatar */}
                  <div
                    className={`h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-full border overflow-hidden ${
                      dark
                        ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA]"
                        : "border-[#D8E1EF] bg-gray-100 text-[#202C50]"
                    }`}
                  >
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : user.name ? (
                      <span className="text-base font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User size={20} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs ${mutedText}`}>
                      Signed in as
                    </p>
                    <p className="truncate text-sm font-bold">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className={`truncate text-xs ${mutedText}`}>
                        {user.email}
                      </p>
                    )}
                    {user.role === "ADMIN" && (
                      <Link
                        to="/dashboard"
                        onClick={closeMenu}
                        className={`mt-1.5 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${adminButton}`}
                      >
                        <ShieldCheck size={13} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={`rounded-lg py-2 text-center text-sm font-bold transition-colors ${adminButton}`}
                >
                  Login to your account
                </Link>
              )}

              {/* Mobile Navigation Links */}
              <nav className={`flex flex-col gap-2 text-sm font-medium ${mainText}`}>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className={`rounded-lg px-3 py-1.5 transition-colors ${navHoverBg}`}
                >
                  Home
                </Link>

                <Link
                  to="/shop"
                  onClick={closeMenu}
                  className={`rounded-lg px-3 py-1.5 transition-colors ${navHoverBg}`}
                >
                  Shop
                </Link>

                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 transition-colors ${navHoverBg}`}
                >
                  <span>My Orders</span>
                  <Package size={16} className={mutedText} />
                </Link>

                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 transition-colors ${navHoverBg}`}
                >
                  <span>Wishlist</span>
                  <span className={`text-xs font-bold ${logoAccent}`}>
                    ({wishlistCount})
                  </span>
                </Link>
              </nav>

              {/* FIXED MOBILE LOGOUT */}
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
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${logoutButton}`}
                  >
                    <LogOut size={16} />
                    <span>
                      {isLogginOut ? "Logging out..." : "Logout"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Category Navigation */}
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
