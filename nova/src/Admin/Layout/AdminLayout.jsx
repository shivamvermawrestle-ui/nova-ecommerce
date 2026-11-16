
import { useState } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UseGlob } from "../../Context/GlobalContext";

import {
  productsApi,
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "../../services/productsApi";

import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Users,
  ShoppingBag,
  Store,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const AdminLayout = () => {
  const { dark, navigate } = UseGlob();
  const location = useLocation();
  const dispatch = useDispatch();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: user } = useGetCurrentUserQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Close mobile menu whenever the route changes
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileMenuOpen(false);
  }

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.error("Admin logout failed:", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("nova_token");
        localStorage.removeItem("nova_user");
        localStorage.removeItem("token");
      }
      dispatch(productsApi.util.resetApiState());
      navigate("/login");
    }
  };

  // Navigation items
  const navItems = [
    {
      to: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/dashboard/products",
      label: "Manage Products",
      icon: Package,
      end: true,
    },
    {
      to: "/dashboard/users",
      label: "Manage Users",
      icon: Users,
      end: true,
    },
    {
      to: "/dashboard/orders",
      label: "Orders",
      icon: ShoppingBag,
      end: false,
    },
  ];

  // Navigation link styling
  const navClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? dark
          ? "bg-[#7895C5] text-[#171E30] font-semibold shadow-sm"
          : "bg-[#202C50] text-white font-semibold shadow-sm"
        : dark
        ? "text-[#AAB8D0] hover:bg-[#2D3B56] hover:text-[#EAF0FA]"
        : "text-[#64718A] hover:bg-[#EDF2F9] hover:text-[#202C50]"
    }`;

  // Navigation icon styling
  const navIconClass = (isActive) =>
    `h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
      isActive
        ? dark
          ? "text-[#171E30]"
          : "text-[#7895C5]"
        : dark
        ? "text-[#8190AA] group-hover:text-[#EAF0FA]"
        : "text-[#8A96AA] group-hover:text-[#202C50]"
    }`;

  // Current page title
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/dashboard") return "Overview";

    if (
      path.startsWith("/dashboard/products") &&
      path.includes("/edit")
    ) {
      return "Edit Product";
    }

    if (path === "/dashboard/products") return "Products Catalog";

    if (path === "/dashboard/add-product") return "Add New Product";

    if (path === "/dashboard/users") return "User Management";

    if (
      path.startsWith("/dashboard/orders/") &&
      path !== "/dashboard/orders"
    ) {
      return "Order Details";
    }

    if (path === "/dashboard/orders") return "Orders & Fulfillment";

    return "Dashboard";
  };

  // Reusable navigation links
  const renderNavItems = () =>
    navItems.map((item) => {
      const Icon = item.icon;

      return (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <Icon className={navIconClass(isActive)} />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      );
    });

  // Reusable user avatar
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className={`min-h-[calc(100vh-5rem)]  transition-colors ${dark?"bg-[#171E30] dark:text-[#EAF0FA] ":"bg-[#F7F9FC] text-[#202C50]"}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:flex-row">

        {/* Mobile Header */}
        <div
          className={`flex items-center justify-between rounded-2xl border p-3 shadow-sm transition-colors sm:p-4 lg:hidden ${
            dark
              ? "border-[#35435C] bg-[#202A40]"
              : "border-[#D8E1EF] bg-white"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`shrink-0 rounded-xl border p-2 transition-colors ${
                dark
                  ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA] hover:bg-[#2D3B56]"
                  : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50] hover:bg-[#EDF2F9]"
              }`}
              aria-label="Toggle admin navigation"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#7895C5]" />
                <span className="truncate text-sm font-bold tracking-tight">
                  Nova Admin
                </span>
              </div>

              <p
                className={`truncate text-xs ${
                  dark ? "text-[#8190AA]" : "text-[#64718A]"
                }`}
              >
                {getPageTitle()}
              </p>
            </div>
          </div>

          <Link
            to="/shop"
            className={`ml-2 flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
              dark
                ? "border-[#35435C] bg-[#171E30] text-[#EAF0FA] hover:bg-[#2D3B56]"
                : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50] hover:bg-[#EDF2F9]"
            }`}
          >
            <Store className="h-3.5 w-3.5 text-[#7895C5]" />
            <span>Store</span>
          </Link>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`flex flex-col gap-4 rounded-2xl border p-4 shadow-md transition-colors lg:hidden ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <p
              className={`px-2 text-xs font-semibold uppercase tracking-wider ${
                dark ? "text-[#8190AA]" : "text-[#8A96AA]"
              }`}
            >
              Navigation
            </p>

            <nav className="flex flex-col gap-1">
              {renderNavItems()}

              <NavLink
                to="/dashboard/add-product"
                className={navClass}
              >
                {({ isActive }) => (
                  <>
                    <PlusCircle className={navIconClass(isActive)} />
                    <span>Add Product</span>
                  </>
                )}
              </NavLink>
            </nav>

            {/* Mobile User Profile */}
            <div
              className={`flex items-center justify-between gap-3 border-t pt-3 ${
                dark ? "border-[#35435C]" : "border-[#D8E1EF]"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    dark
                      ? "bg-[#34415B] text-[#7895C5]"
                      : "bg-[#DFE7F3] text-[#202C50]"
                  }`}
                >
                  {userInitial}
                </div>

                <div className="min-w-0 text-xs">
                  <p className="truncate font-semibold">
                    {user?.name || "Admin"}
                  </p>

                  <p
                    className={`truncate ${
                      dark ? "text-[#8190AA]" : "text-[#64718A]"
                    }`}
                  >
                    {user?.email || "admin@store.com"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside
          className={`hidden w-64 shrink-0 flex-col justify-between rounded-2xl border p-5 shadow-sm transition-colors lg:flex ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
              : "border-[#D8E1EF] bg-white text-[#202C50]"
          }`}
        >
          <div className="flex flex-col gap-7">

            {/* Admin Header */}
            <div
              className={`flex items-center justify-between border-b pb-5 ${
                dark ? "border-[#35435C]" : "border-[#D8E1EF]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    dark
                      ? "bg-[#34415B] text-[#7895C5]"
                      : "bg-[#DFE7F3] text-[#202C50]"
                  }`}
                >
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-bold tracking-tight">
                    Nova Admin
                  </h2>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                    <span
                      className={`text-[11px] font-medium ${
                        dark ? "text-[#8190AA]" : "text-[#64718A]"
                      }`}
                    >
                      Console Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Menu */}
            <div className="flex flex-col gap-2">
              <p
                className={`px-3 text-[11px] font-semibold uppercase tracking-wider ${
                  dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                }`}
              >
                Main Menu
              </p>

              <nav className="flex flex-col gap-1">
                {renderNavItems()}
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2">
              <p
                className={`px-3 text-[11px] font-semibold uppercase tracking-wider ${
                  dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                }`}
              >
                Quick Actions
              </p>

              <nav className="flex flex-col gap-1">
                <NavLink
                  to="/dashboard/add-product"
                  className={navClass}
                >
                  {({ isActive }) => (
                    <>
                      <PlusCircle className={navIconClass(isActive)} />
                      <span>Add Product</span>
                    </>
                  )}
                </NavLink>

                <Link
                  to="/shop"
                  className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    dark
                      ? "text-[#AAB8D0] hover:bg-[#2D3B56] hover:text-[#EAF0FA]"
                      : "text-[#64718A] hover:bg-[#EDF2F9] hover:text-[#202C50]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Store
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                      }`}
                    />

                    <span>View Store</span>
                  </div>

                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </Link>
              </nav>
            </div>
          </div>

          {/* Desktop User Profile */}
          <div
            className={`mt-8 flex flex-col gap-3 border-t pt-5 ${
              dark ? "border-[#35435C]" : "border-[#D8E1EF]"
            }`}
          >
            <div className="flex min-w-0 items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    dark
                      ? "bg-[#34415B] text-[#7895C5]"
                      : "bg-[#DFE7F3] text-[#202C50]"
                  }`}
                >
                  {userInitial}
                </div>

                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-xs font-semibold leading-tight">
                    {user?.name || "Administrator"}
                  </span>

                  <span
                    className={`truncate text-[11px] ${
                      dark ? "text-[#8190AA]" : "text-[#64718A]"
                    }`}
                  >
                    {user?.email || "admin@store.com"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section
          className={`flex min-h-[60vh] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-sm transition-colors ${
            dark
              ? "border-[#35435C] bg-[#202A40]"
              : "border-[#D8E1EF] bg-white"
          }`}
        >
          {/* Top Context & Breadcrumb Bar */}
          <div
            className={`hidden items-center justify-between border-b px-6 py-3.5 transition-colors sm:flex ${
              dark
                ? "border-[#35435C] bg-[#171E30]/40"
                : "border-[#D8E1EF] bg-[#F7F9FC]/80"
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              <Link
                to="/dashboard"
                className={`font-medium transition-colors hover:underline ${
                  dark ? "text-[#7895C5]" : "text-[#344F82]"
                }`}
              >
                Dashboard
              </Link>

              <ChevronRight
                className={`h-3 w-3 ${
                  dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                }`}
              />

              <span
                className={`font-semibold ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {getPageTitle()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  dark
                    ? "bg-[#34415B] text-[#7895C5]"
                    : "bg-[#DFE7F3] text-[#202C50]"
                }`}
              >
                <ShieldCheck className="h-3 w-3" />
                <span>Admin Mode</span>
              </span>

              <Link
                to="/"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  dark
                    ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
                    : "border-[#C9D5E7] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
                }`}
              >
                <Store className="h-3 w-3 text-[#7895C5]" />
                <span>Store</span>
              </Link>
            </div>
          </div>

          {/* Child Page Content */}
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
