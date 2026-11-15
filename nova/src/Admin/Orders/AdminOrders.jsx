import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import { useGetAdminOrdersQuery } from "../../services/productsApi";
import {
  Search,
  ShoppingBag,
  CreditCard,
  Truck,
  Eye,
  Copy,
  Check,
  X,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";

const AdminOrders = () => {
  const { formatPrice, dark } = UseGlob();
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useGetAdminOrdersQuery();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [copiedId, setCopiedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Calculate order statistics
  const stats = useMemo(() => {
    return {
      total: orders.length,
      placed: orders.filter((o) => (o.orderStatus || "PLACED") === "PLACED")
        .length,
      processing: orders.filter((o) => o.orderStatus === "PROCESSING").length,
      shipped: orders.filter((o) => o.orderStatus === "SHIPPED").length,
      delivered: orders.filter((o) => o.orderStatus === "DELIVERED").length,
      cancelled: orders.filter((o) => o.orderStatus === "CANCELLED").length,
      totalRevenue: orders.reduce(
        (acc, o) => acc + (Number(o.totalAmount) || 0),
        0,
      ),
    };
  }, [orders]);

  const handleCopyId = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = orders.filter((order) => {
      const idMatch = order._id.toLowerCase().includes(normalizedSearch);
      const emailMatch = (order.email || "")
        .toLowerCase()
        .includes(normalizedSearch);
      const nameMatch = (order.shippingAddress?.name || "")
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesSearch =
        !normalizedSearch || idMatch || emailMatch || nameMatch;

      const currentStatus = order.orderStatus || "PLACED";
      const matchesStatus =
        statusFilter === "ALL" || currentStatus === statusFilter;

      const isPaid =
        (order.paymentDetails?.payment_status || "").toLowerCase() === "paid";

      const matchesPayment =
        paymentFilter === "ALL" ||
        (paymentFilter === "PAID" && isPaid) ||
        (paymentFilter === "PENDING" && !isPaid);

      return matchesSearch && matchesStatus && matchesPayment;
    });

    return result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortBy === "amount_high") {
        return (Number(b.totalAmount) || 0) - (Number(a.totalAmount) || 0);
      }

      if (sortBy === "amount_low") {
        return (Number(a.totalAmount) || 0) - (Number(b.totalAmount) || 0);
      }

      return 0;
    });
  }, [orders, search, statusFilter, paymentFilter, sortBy]);

  // Pagination slice
  const totalPages =
    Math.ceil(filteredAndSortedOrders.length / itemsPerPage) || 1;

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(start, start + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage]);

  const hasActiveFilters =
    search ||
    statusFilter !== "ALL" ||
    paymentFilter !== "ALL" ||
    sortBy !== "newest";

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div
          className={`h-10 w-10 border-4 rounded-full animate-spin ${
            dark
              ? "border-[#35435C] border-t-[#7895C5]"
              : "border-[#D8E1EF] border-t-[#202C50]"
          }`}
        />

        <p
          className={`text-sm font-medium ${dark ? "text-[#8190AA]" : "text-[#64718A]"}`}
        >
          Loading orders...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div
          className={`rounded-2xl border p-12 text-center flex flex-col items-center gap-3 ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
              : "border-[#D8E1EF] bg-white text-[#202C50]"
          }`}
        >
          <AlertCircle
            className={`w-10 h-10 ${dark ? "text-[#F08089]" : "text-[#C04452]"}`}
          />

          <h2 className="text-xl font-bold">Could not load orders</h2>

          <p
            className={`text-sm ${dark ? "text-[#8190AA]" : "text-[#64718A]"}`}
          >
            {error?.data?.message ||
              "An unexpected error occurred while fetching orders."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1
              className={`text-xl lg:text-2xl font-bold tracking-tight ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              Order Management
            </h1>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                dark
                  ? "bg-[#34415B] text-[#7895C5]"
                  : "bg-[#DFE7F3] text-[#202C50]"
              }`}
            >
              {orders.length}
            </span>
          </div>

          <p
            className={`text-xs sm:text-sm mt-0.5 ${
              dark ? "text-[#8190AA]" : "text-[#64718A]"
            }`}
          >
            Review customer orders, monitor fulfillment states, and inspect
            checkout transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`rounded-xl border px-3.5 py-2 text-right ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <p
              className={`text-[10px] uppercase font-semibold tracking-wider ${
                dark ? "text-[#8190AA]" : "text-[#64718A]"
              }`}
            >
              Total Sales Volume
            </p>

            <p
              className={`text-base font-bold ${
                dark ? "text-[#7895C5]" : "text-[#202C50]"
              }`}
            >
              {formatPrice.format(stats.totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Status Filter Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 w-full lg:grid-cols-6 gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "ALL", label: "All Orders", count: stats.total },
          { id: "PLACED", label: "Placed", count: stats.placed },
          { id: "PROCESSING", label: "Processing", count: stats.processing },
          { id: "SHIPPED", label: "Shipped", count: stats.shipped },
          { id: "DELIVERED", label: "Delivered", count: stats.delivered },
          { id: "CANCELLED", label: "Cancelled", count: stats.cancelled },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 w-full py-2 text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? dark
                    ? "bg-[#7895C5] text-[#171E30] border-[#7895C5] shadow-xs"
                    : "bg-[#202C50] text-white border-[#202C50] shadow-xs"
                  : dark
                    ? "bg-[#202A40] text-[#AAB8D0] border-[#35435C] hover:bg-[#2D3B56] hover:text-[#EAF0FA]"
                    : "bg-white text-[#64718A] border-[#D8E1EF] hover:bg-[#EDF2F9] hover:text-[#202C50]"
              }`}
            >
              <span>{tab.label}</span>

              <span
                className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? dark
                      ? "bg-[#171E30] text-[#7895C5]"
                      : "bg-white text-[#202C50]"
                    : dark
                      ? "bg-[#171E30] text-[#8190AA]"
                      : "bg-[#DFE7F3] text-[#64718A]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar Controls */}
      <div
        className={`rounded-2xl border p-4 shadow-sm transition-colors flex flex-col md:flex-row items-stretch md:items-center gap-3 ${
          dark ? "border-[#35435C] bg-[#202A40]" : "border-[#D8E1EF] bg-white"
        }`}
      >
        {/* Search input with icon */}
        <div className="relative flex-1">
          <Search
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
              dark ? "text-[#8190AA]" : "text-[#8A96AA]"
            }`}
          />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by order ID, email, or customer name..."
            className={`w-full rounded-xl border pl-10 pr-9 py-2 text-xs sm:text-sm outline-none transition-colors shadow-2xs ${
              dark
                ? "bg-[#171E30] border-[#465570] text-[#EAF0FA] placeholder-[#8190AA] focus:border-[#9BB2D8]"
                : "bg-[#F7F9FC] border-[#C9D5E7] text-[#202C50] placeholder-[#8A96AA] focus:border-[#7895C5]"
            }`}
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                dark
                  ? "text-[#8190AA] hover:text-[#EAF0FA]"
                  : "text-[#8A96AA] hover:text-[#202C50]"
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdowns row */}
        <div className="flex items-center gap-2.5">
          {/* Payment filter */}
          <div className="flex w-full items-center gap-1.5">
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`rounded-xl w-full border px-3 py-2 text-xs font-medium outline-none transition-colors shadow-2xs ${
                dark
                  ? "bg-[#171E30] border-[#465570] text-[#EAF0FA] focus:border-[#9BB2D8]"
                  : "bg-[#F7F9FC] border-[#C9D5E7] text-[#202C50] focus:border-[#7895C5]"
              }`}
            >
              <option value="ALL">All Payments</option>
              <option value="PAID">Paid Only</option>
              <option value="PENDING">Pending Only</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex w-full items-center gap-1.5">
            <ArrowUpDown
              className={`h-3.5 w-3.5 hidden sm:block ${
                dark ? "text-[#8190AA]" : "text-[#8A96AA]"
              }`}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`rounded-xl border w-full px-3 py-2 text-xs font-medium outline-none transition-colors shadow-2xs ${
                dark
                  ? "bg-[#171E30] border-[#465570] text-[#EAF0FA] focus:border-[#9BB2D8]"
                  : "bg-[#F7F9FC] border-[#C9D5E7] text-[#202C50] focus:border-[#7895C5]"
              }`}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Highest Amount</option>
              <option value="amount_low">Lowest Amount</option>
            </select>
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold flex items-center gap-1 transition-colors ${
                dark
                  ? "border-[#35435C] bg-[#171E30] text-[#7895C5] hover:bg-[#2D3B56]"
                  : "border-[#D8E1EF] bg-white text-[#344F82] hover:bg-[#EDF2F9]"
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Orders Table Container */}
      {filteredAndSortedOrders.length === 0 ? (
        <div
          className={`rounded-2xl border p-12 text-center flex flex-col items-center gap-3 ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
              : "border-[#D8E1EF] bg-white text-[#202C50]"
          }`}
        >
          <ShoppingBag
            className={`w-10 h-10 ${dark ? "text-[#8190AA]" : "text-[#8A96AA]"}`}
          />

          <h3 className="text-base font-bold">No orders found</h3>

          <p
            className={`text-xs max-w-sm ${
              dark ? "text-[#8190AA]" : "text-[#64718A]"
            }`}
          >
            No orders match your current filter and search criteria. Try
            adjusting or clearing your filters.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className={`mt-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                dark
                  ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                  : "bg-[#202C50] text-white hover:bg-[#344F82]"
              }`}
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div
          className={`overflow-hidden rounded-2xl border shadow-sm transition-colors ${
            dark ? "bg-[#202A40] border-[#35435C]" : "bg-white border-[#D8E1EF]"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-center border-collapse">
              <thead>
                <tr
                  className={`border-b text-xs font-semibold uppercase tracking-wider ${
                    dark
                      ? "border-[#35435C] text-[#AAB8D0] bg-[#26334D]"
                      : "border-[#D8E1EF] text-[#64718A] bg-[#DFE7F3]"
                  }`}
                >
                  <th className="px-4 py-3.5 text-left">Order ID</th>
                  <th className="px-4 py-3.5 text-left">Customer</th>
                  <th className="px-3 py-3.5">Date</th>
                  <th className="px-3 py-3.5">Items</th>
                  <th className="px-3 py-3.5">Payment</th>
                  <th className="px-3 py-3.5">Fulfillment</th>
                  <th className="px-4 py-3.5 text-right">Total</th>
                  <th className="px-4 py-3.5 text-center">Action</th>
                </tr>
              </thead>

              <tbody
                className={`divide-y text-xs sm:text-sm ${
                  dark
                    ? "divide-[#35435C]/60 text-[#EAF0FA]"
                    : "divide-[#D8E1EF] text-[#202C50]"
                }`}
              >
                {paginatedOrders.map((order) => {
                  const isPaid =
                    (
                      order.paymentDetails?.payment_status || ""
                    ).toLowerCase() === "paid";

                  const fulfillment = order.orderStatus || "PLACED";
                  const itemCount = order.productDetails?.length || 0;
                  const isCopied = copiedId === order._id;

                  const dateFormatted = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-";

                  return (
                    <tr
                      key={order._id}
                      className={`transition-colors ${
                        dark ? "hover:bg-[#2D3B56]" : "hover:bg-[#EDF2F9]"
                      }`}
                    >
                      {/* Order ID */}
                      <td className="px-4 py-3 text-left">
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/dashboard/orders/${order._id}`}
                            className={`font-mono font-bold hover:underline ${
                              dark ? "text-[#7895C5]" : "text-[#202C50]"
                            }`}
                          >
                            #{order._id.slice(-8).toUpperCase()}
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleCopyId(order._id, e)}
                            className={`p-1 rounded transition-colors ${
                              dark
                                ? "text-[#8190AA] hover:text-[#EAF0FA] hover:bg-[#171E30]"
                                : "text-[#8A96AA] hover:text-[#202C50] hover:bg-[#F7F9FC]"
                            }`}
                            title="Copy full ID"
                          >
                            {isCopied ? (
                              <Check
                                className={`w-3.5 h-3.5 ${
                                  dark ? "text-[#65C995]" : "text-[#27845B]"
                                }`}
                              />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3 text-left max-w-[200px]">
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold truncate">
                            {order.shippingAddress?.name || "Customer"}
                          </span>

                          <span
                            className={`text-xs truncate ${
                              dark ? "text-[#8190AA]" : "text-[#64718A]"
                            }`}
                            title={order.email}
                          >
                            {order.email || "-"}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td
                        className={`px-3 py-3 text-xs whitespace-nowrap ${
                          dark ? "text-[#8190AA]" : "text-[#64718A]"
                        }`}
                      >
                        {dateFormatted}
                      </td>

                      {/* Items */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                            dark
                              ? "bg-[#171E30] text-[#AAB8D0]"
                              : "bg-[#F7F9FC] text-[#64718A]"
                          }`}
                        >
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                            isPaid
                              ? dark
                                ? "bg-emerald-950/40 text-[#65C995]"
                                : "bg-emerald-100 text-[#27845B]"
                              : dark
                                ? "bg-amber-950/40 text-[#E6B66F]"
                                : "bg-amber-100 text-[#A66A22]"
                          }`}
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>
                            {order.paymentDetails?.payment_status || "Pending"}
                          </span>
                        </span>
                      </td>

                      {/* Fulfillment */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            fulfillment === "DELIVERED"
                              ? dark
                                ? "bg-emerald-950/40 text-[#65C995]"
                                : "bg-emerald-100 text-[#27845B]"
                              : fulfillment === "CANCELLED"
                                ? dark
                                  ? "bg-red-950/40 text-[#F08089]"
                                  : "bg-red-100 text-[#C04452]"
                                : fulfillment === "SHIPPED"
                                  ? dark
                                    ? "bg-blue-950/40 text-[#8CB4EC]"
                                    : "bg-blue-100 text-[#3568A8]"
                                  : fulfillment === "PROCESSING"
                                    ? dark
                                      ? "bg-amber-950/40 text-[#E6B66F]"
                                      : "bg-amber-100 text-[#A66A22]"
                                    : dark
                                      ? "bg-[#26334D] text-[#AAB8D0]"
                                      : "bg-[#DFE7F3] text-[#64718A]"
                          }`}
                        >
                          <Truck className="w-3 h-3" />
                          <span>{fulfillment}</span>
                        </span>
                      </td>

                      {/* Total */}
                      <td
                        className={`px-4 py-3 text-right font-bold whitespace-nowrap ${
                          dark ? "text-[#7895C5]" : "text-[#202C50]"
                        }`}
                      >
                        {formatPrice.format(Number(order.totalAmount || 0))}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <Link
                          to={`/dashboard/orders/${order._id}`}
                          className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors shadow-2xs ${
                            dark
                              ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                              : "bg-[#202C50] text-white hover:bg-[#344F82]"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination and Table Footer */}
          <div
            className={`border-t px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
              dark
                ? "border-[#35435C] bg-[#171E30]/40 text-[#8190AA]"
                : "border-[#D8E1EF] bg-[#F7F9FC]/80 text-[#64718A]"
            }`}
          >
            <div>
              Showing{" "}
              <span
                className={`font-semibold ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filteredAndSortedOrders.length,
                )}
              </span>{" "}
              to{" "}
              <span
                className={`font-semibold ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAndSortedOrders.length,
                )}
              </span>{" "}
              of{" "}
              <span
                className={`font-semibold ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                {filteredAndSortedOrders.length}
              </span>{" "}
              orders
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`rounded-lg border px-2.5 py-1 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    dark
                      ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
                      : "border-[#C9D5E7] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    const isCurrent = pageNum === currentPage;

                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-7 w-7 rounded-lg text-xs font-semibold transition-colors ${
                          isCurrent
                            ? dark
                              ? "bg-[#7895C5] text-[#171E30]"
                              : "bg-[#202C50] text-white"
                            : dark
                              ? "hover:bg-[#2D3B56] text-[#AAB8D0]"
                              : "hover:bg-[#EDF2F9] text-[#64718A]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  },
                )}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`rounded-lg border px-2.5 py-1 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    dark
                      ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
                      : "border-[#C9D5E7] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminOrders;
