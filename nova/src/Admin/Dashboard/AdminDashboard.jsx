import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";

import {
  useGetAdminOrdersQuery,
  useGetProductsQuery,
  useGetUsersQuery,
} from "../../services/productsApi";

import {
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  Coins,
  CheckCircle2,
} from "lucide-react";

const AdminDashboard = () => {
  const { formatPrice, dark } = UseGlob();

  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    isError,
    error,
    refetch,
  } = useGetAdminOrdersQuery();

  const { data: products = [], isLoading: isLoadingProducts } =
    useGetProductsQuery();

  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery();

  const isLoading = isLoadingOrders || isLoadingProducts || isLoadingUsers;

  // Loading Skeleton State

// Loading Skeleton State
if (isLoading && orders.length === 0) {
  return (
    <main
      className={`flex flex-col gap-6 p-4 sm:p-6 animate-pulse ${
        dark ? "bg-[#171E30]" : "bg-[#F7F9FC]"
      }`}
    >
      <div
        className={`h-4 w-28 rounded ${
          dark ? "bg-[#26334D]" : "bg-[#DFE7F3]"
        }`}
      />

      <div
        className={`h-8 w-44 rounded ${
          dark ? "bg-[#26334D]" : "bg-[#DFE7F3]"
        }`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-28 rounded-2xl ${
              dark ? "bg-[#26334D]" : "bg-[#DFE7F3]"
            }`}
          />
        ))}
      </div>

      <div
        className={`h-64 rounded-2xl mt-4 ${
          dark ? "bg-[#26334D]" : "bg-[#DFE7F3]"
        }`}
      />
    </main>
  );
}

  // Error State
  if (isError) {
    return (
      <main className="flex flex-col items-center justify-center p-8 sm:p-12 text-center gap-4">
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-full border ${
            dark
              ? "bg-[#F08089]/10 border-[#F08089]/20 text-[#F08089]"
              : "bg-[#C04452]/10 border-[#C04452]/20 text-[#C04452]"
          }`}
        >
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h1
          className={`text-xl font-bold ${
            dark ? "text-[#EAF0FA]" : "text-[#202C50]"
          }`}
        >
          Could Not Load Dashboard
        </h1>

        <p
          className={`text-xs sm:text-sm max-w-sm ${
            dark ? "text-[#AAB8D0]" : "text-[#64718A]"
          }`}
        >
          {error?.data?.message ||
            "An error occurred while loading administrative analytics."}
        </p>

        <button
          type="button"
          onClick={refetch}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors ${
            dark
              ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
              : "bg-[#202C50] text-white hover:bg-[#344F82]"
          }`}
        >
          Retry
        </button>
      </main>
    );
  }

  // Business Analytics Calculations
  const paidOrders = orders.filter(
    (order) =>
      order.paymentDetails?.payment_status === "paid" ||
      order.paymentDetails?.payment_status === "SUCCESS",
  );

  const revenue = paidOrders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0,
  );

  const pendingOrders = orders.filter((order) =>
    ["PLACED", "PROCESSING"].includes(order.orderStatus || "PLACED"),
  );

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "DELIVERED",
  );

  const lowStockProducts = products.filter((p) => Number(p.stock ?? 0) <= 5);

  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED":
        return {
          bg: "bg-[#27845B]/10 border-[#27845B]/25 text-[#27845B] dark:bg-[#65C995]/10 dark:border-[#65C995]/25 dark:text-[#65C995]",
          dot: "bg-[#27845B] dark:bg-[#65C995]",
        };

      case "SHIPPED":
        return {
          bg: "bg-[#3568A8]/10 border-[#3568A8]/25 text-[#3568A8] dark:bg-[#8CB4EC]/10 dark:border-[#8CB4EC]/25 dark:text-[#8CB4EC]",
          dot: "bg-[#3568A8] dark:bg-[#8CB4EC]",
        };

      case "PROCESSING":
      case "PLACED":
        return {
          bg: "bg-[#A66A22]/10 border-[#A66A22]/25 text-[#A66A22] dark:bg-[#E6B66F]/10 dark:border-[#E6B66F]/25 dark:text-[#E6B66F]",
          dot: "bg-[#A66A22] dark:bg-[#E6B66F] animate-pulse",
        };

      case "CANCELLED":
        return {
          bg: "bg-[#C04452]/10 border-[#C04452]/25 text-[#C04452] dark:bg-[#F08089]/10 dark:border-[#F08089]/25 dark:text-[#F08089]",
          dot: "bg-[#C04452] dark:bg-[#F08089]",
        };

      default:
        return {
          bg: "bg-[#DFE7F3] border-[#D8E1EF] text-[#64718A] dark:bg-[#26334D] dark:border-[#35435C] dark:text-[#AAB8D0]",
          dot: "bg-[#8A96AA] dark:bg-[#8190AA]",
        };
    }
  };

  return (
    <main className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Dashboard Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                dark ? "text-[#7895C5]" : "text-[#202C50]"
              }`}
            >
              Control Center
            </span>

            <span
              className={`w-1 h-1 rounded-full ${
                dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
              }`}
            />

            <span
              className={`text-xs font-medium ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Live Business Metrics
            </span>
          </div>

          <h1
            className={`mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight ${
              dark ? "text-[#EAF0FA]" : "text-[#202C50]"
            }`}
          >
            Admin Overview
          </h1>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Revenue */}
        <article
          className={`rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${
            dark
              ? "border-[#35435C] bg-[#202A40] hover:bg-[#2D3B56]"
              : "border-[#D8E1EF] bg-white hover:bg-[#EDF2F9]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <p
              className={`text-xs font-bold uppercase tracking-wider ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Total Revenue
            </p>

            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                dark
                  ? "bg-[#171E30] text-[#7895C5]"
                  : "bg-[#DFE7F3] text-[#202C50]"
              }`}
            >
              <Coins className="w-4 h-4" />
            </div>
          </div>

          <p
            className={`mt-3 text-2xl sm:text-3xl font-black ${
              dark ? "text-[#7895C5]" : "text-[#202C50]"
            }`}
          >
            {formatPrice.format(revenue)}
          </p>

          <p
            className={`mt-1.5 text-xs font-medium ${
              dark ? "text-[#AAB8D0]" : "text-[#64718A]"
            }`}
          >
            From <span className="font-semibold">{paidOrders.length}</span> paid
            orders
          </p>
        </article>

        {/* Card 2: Total Orders */}
        <article
          className={`rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${
            dark
              ? "border-[#35435C] bg-[#202A40] hover:bg-[#2D3B56]"
              : "border-[#D8E1EF] bg-white hover:bg-[#EDF2F9]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <p
              className={`text-xs font-bold uppercase tracking-wider ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Total Orders
            </p>

            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                dark
                  ? "bg-[#171E30] text-[#7895C5]"
                  : "bg-[#DFE7F3] text-[#202C50]"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>

          <p
            className={`mt-3 text-2xl sm:text-3xl font-black ${
              dark ? "text-[#EAF0FA]" : "text-[#202C50]"
            }`}
          >
            {orders.length}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            <span
              className={`font-semibold ${
                pendingOrders.length > 0
                  ? "text-[#A66A22] dark:text-[#E6B66F]"
                  : dark
                    ? "text-[#AAB8D0]"
                    : "text-[#64718A]"
              }`}
            >
              {pendingOrders.length} pending
            </span>

            <span className="opacity-50">·</span>

            <span
              className={`font-medium ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              {deliveredOrders.length} delivered
            </span>
          </div>
        </article>

        {/* Card 3: Products in Catalog */}
        <article
          className={`rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${
            dark
              ? "border-[#35435C] bg-[#202A40] hover:bg-[#2D3B56]"
              : "border-[#D8E1EF] bg-white hover:bg-[#EDF2F9]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <p
              className={`text-xs font-bold uppercase tracking-wider ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Products
            </p>

            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                dark
                  ? "bg-[#171E30] text-[#7895C5]"
                  : "bg-[#DFE7F3] text-[#202C50]"
              }`}
            >
              <Package className="w-4 h-4" />
            </div>
          </div>

          <p
            className={`mt-3 text-2xl sm:text-3xl font-black ${
              dark ? "text-[#EAF0FA]" : "text-[#202C50]"
            }`}
          >
            {products.length}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            {lowStockProducts.length > 0 ? (
              <span className="font-semibold text-[#C04452] dark:text-[#F08089] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {lowStockProducts.length} low stock
              </span>
            ) : (
              <span className="font-medium text-[#27845B] dark:text-[#65C995] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Stock healthy
              </span>
            )}
          </div>
        </article>

        {/* Card 4: Registered Users */}
        <article
          className={`rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${
            dark
              ? "border-[#35435C] bg-[#202A40] hover:bg-[#2D3B56]"
              : "border-[#D8E1EF] bg-white hover:bg-[#EDF2F9]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <p
              className={`text-xs font-bold uppercase tracking-wider ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Customers
            </p>

            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                dark
                  ? "bg-[#171E30] text-[#7895C5]"
                  : "bg-[#DFE7F3] text-[#202C50]"
              }`}
            >
              <Users className="w-4 h-4" />
            </div>
          </div>

          <p
            className={`mt-3 text-2xl sm:text-3xl font-black ${
              dark ? "text-[#EAF0FA]" : "text-[#202C50]"
            }`}
          >
            {users.length}
          </p>

          <p
            className={`mt-1.5 text-xs font-medium ${
              dark ? "text-[#AAB8D0]" : "text-[#64718A]"
            }`}
          >
            Registered user accounts
          </p>
        </article>
      </section>

      {/* Low Stock Warning Alert */}
      {lowStockProducts.length > 0 && (
        <section
          className={`rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            dark
              ? "bg-[#E6B66F]/10 border-[#E6B66F]/25 text-[#EAF0FA]"
              : "bg-[#A66A22]/5 border-[#A66A22]/25 text-[#202C50]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                dark
                  ? "bg-[#E6B66F]/15 text-[#E6B66F]"
                  : "bg-[#A66A22]/10 text-[#A66A22]"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-bold">
                Low Inventory Notice
              </p>

              <p
                className={`text-xs ${
                  dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                }`}
              >
                {lowStockProducts.length} product
                {lowStockProducts.length > 1 ? "s have" : " has"} 5 or fewer
                units left in stock.
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/products"
            className={`text-xs font-bold underline shrink-0 transition-colors ${
              dark
                ? "text-[#E6B66F] hover:text-[#F0CC91]"
                : "text-[#A66A22] hover:text-[#805019]"
            }`}
          >
            Review inventory →
          </Link>
        </section>
      )}

      {/* Recent Orders Section */}
      <section className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2
              className={`text-lg sm:text-xl font-bold tracking-tight ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              Recent Orders
            </h2>

            <p
              className={`text-xs mt-0.5 ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Latest customer purchases and order fulfillment statuses
            </p>
          </div>

          <Link
            to="/dashboard/orders"
            className={`inline-flex items-center gap-1 text-xs font-bold transition-colors hover:underline ${
              dark ? "text-[#7895C5]" : "text-[#344F82]"
            }`}
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div
            className={`rounded-2xl border p-10 text-center ${
              dark
                ? "border-[#35435C] bg-[#171E30]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <ShoppingBag
              className={`w-8 h-8 mx-auto mb-2 ${
                dark ? "text-[#8190AA]" : "text-[#8A96AA]"
              }`}
            />

            <p
              className={`text-sm font-semibold ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              No orders placed yet.
            </p>
          </div>
        ) : (
          <div
            className={`overflow-x-auto rounded-2xl border shadow-sm ${
              dark
                ? "border-[#35435C] bg-[#171E30]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <table className="w-full min-w-[700px] text-center border-collapse">
              <thead>
                <tr
                  className={`border-b text-xs font-bold uppercase tracking-wider ${
                    dark
                      ? "border-[#35435C] text-[#AAB8D0] bg-[#26334D]"
                      : "border-[#D8E1EF] text-[#64718A] bg-[#DFE7F3]"
                  }`}
                >
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Fulfillment</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>

              <tbody
                className={`divide-y text-xs sm:text-sm ${
                  dark
                    ? "divide-[#35435C]/60 text-[#EAF0FA]"
                    : "divide-[#D8E1EF] text-[#202C50]"
                }`}
              >
                {orders.slice(0, 6).map((order) => {
                  const statusInfo = getStatusBadge(
                    order.orderStatus || "PLACED",
                  );

                  return (
                    <tr
                      key={order._id}
                      className={`transition-colors ${
                        dark ? "hover:bg-[#2D3B56]" : "hover:bg-[#EDF2F9]"
                      }`}
                    >
                      <td className="p-3.5 font-mono font-bold">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      <td
                        className={`p-3.5 max-w-[180px] truncate ${
                          dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                        }`}
                      >
                        {order.email || "Customer"}
                      </td>

                      <td
                        className={`p-3.5 ${
                          dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                        }`}
                      >
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            order.paymentDetails?.payment_status === "paid" ||
                            order.paymentDetails?.payment_status === "SUCCESS"
                              ? "bg-[#27845B]/10 text-[#27845B] dark:bg-[#65C995]/10 dark:text-[#65C995]"
                              : "bg-[#A66A22]/10 text-[#A66A22] dark:bg-[#E6B66F]/10 dark:text-[#E6B66F]"
                          }`}
                        >
                          {order.paymentDetails?.payment_status || "Pending"}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.bg}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}
                          />

                          <span>{order.orderStatus || "PLACED"}</span>
                        </span>
                      </td>

                      <td
                        className={`p-3.5 font-bold ${
                          dark ? "text-[#7895C5]" : "text-[#202C50]"
                        }`}
                      >
                        {formatPrice.format(Number(order.totalAmount || 0))}
                      </td>

                      <td className="p-3.5">
                        <Link
                          to={`/dashboard/orders/${order._id}`}
                          className={`inline-flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                            dark
                              ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                              : "bg-[#202C50] text-white hover:bg-[#344F82]"
                          }`}
                        >
                          <span>View</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminDashboard;
