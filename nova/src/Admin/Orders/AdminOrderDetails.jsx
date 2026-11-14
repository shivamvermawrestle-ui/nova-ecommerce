import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../services/productsApi";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle2,
  Truck,
  Package,
  MapPin,
  Mail,
  Phone,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  User,
} from "lucide-react";

const STAGES = [
  { id: "PLACED", label: "Placed", desc: "Order received" },
  { id: "PROCESSING", label: "Processing", desc: "Preparing shipment" },
  { id: "SHIPPED", label: "Shipped", desc: "In transit" },
  { id: "DELIVERED", label: "Delivered", desc: "Fulfilled" },
];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const { formatPrice, dark } = UseGlob();
  const [copiedId, setCopiedId] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useGetAdminOrdersQuery();

  const order = orders.find((item) => item._id === id);
  const currentStatus = order?.orderStatus || "PLACED";

  const [statusDraft, setStatusDraft] = useState({
    orderId: null,
    status: null,
  });

  const selectedStatus =
    statusDraft.orderId === id && statusDraft.status !== null
      ? statusDraft.status
      : currentStatus;

  const [updateOrderStatus, { isLoading: isUpdating, error: updateError }] =
    useUpdateOrderStatusMutation();

  const shippingAddress = order?.shippingAddress || {};
  const address = shippingAddress.address || {};

  const handleCopyId = () => {
    if (order?._id) {
      navigator.clipboard.writeText(order._id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleStatusSave = async () => {
    if (!order || selectedStatus === currentStatus) return;
    try {
      await updateOrderStatus({
        orderId: order._id,
        orderStatus: selectedStatus,
      }).unwrap();
      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 3000);
    } catch (err) {
      console.error("Order status update failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="h-10 w-10 border-4 border-[#D8E1EF] border-t-[#202C50] dark:border-[#35435C] dark:border-t-[#7895C5] rounded-full animate-spin" />
        <p className={`text-sm font-medium ${dark ? "text-[#8190AA]" : "text-[#64718A]"}`}>
          Loading order details...
        </p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-[#202C50] dark:text-[#EAF0FA]">
        <Link
          to="/dashboard/orders"
          className={`inline-flex items-center gap-2 text-xs font-semibold hover:underline mb-6 ${
            dark ? "text-[#7895C5]" : "text-[#344F82]"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to orders</span>
        </Link>
        <div
          className={`rounded-2xl border p-12 text-center flex flex-col items-center gap-3 ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
              : "border-[#D8E1EF] bg-white text-[#202C50]"
          }`}
        >
          <AlertCircle className="w-10 h-10 text-[#C04452] dark:text-[#F08089]" />
          <h2 className="text-xl font-bold">Could not find order</h2>
          <p className={`text-sm ${dark ? "text-[#8190AA]" : "text-[#64718A]"}`}>
            {error?.data?.message || "The requested order ID does not exist or has been removed."}
          </p>
          <Link
            to="/dashboard/orders"
            className="mt-2 rounded-xl bg-[#202C50] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#344F82] dark:bg-[#7895C5] dark:text-[#171E30] dark:hover:bg-[#9BB2D8] transition-colors shadow-xs"
          >
            Return to Orders
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = (order.paymentDetails?.payment_status || "").toLowerCase() === "paid";
  const stageIndex = STAGES.findIndex((s) => s.id === currentStatus);
  const itemsSubtotal = (order.productDetails || []).reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

  const formattedTime = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto flex flex-col gap-6 text-[#202C50] dark:text-[#EAF0FA]">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/dashboard/orders"
          className={`inline-flex items-center gap-2 text-xs font-semibold rounded-xl px-3.5 py-2 border transition-colors ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56] hover:text-[#7895C5]"
              : "border-[#D8E1EF] bg-white text-[#202C50] hover:bg-[#EDF2F9] hover:text-[#344F82]"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to orders</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Payment Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize border ${
              isPaid
                ? "bg-[#27845B]/10 text-[#27845B] border-[#27845B]/20 dark:bg-[#65C995]/15 dark:text-[#65C995] dark:border-[#65C995]/30"
                : "bg-[#A66A22]/10 text-[#A66A22] border-[#A66A22]/20 dark:bg-[#E6B66F]/15 dark:text-[#E6B66F] dark:border-[#E6B66F]/30"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payment: {order.paymentDetails?.payment_status || "Pending"}</span>
          </span>

          {/* Fulfillment Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
              currentStatus === "DELIVERED"
                ? "bg-[#27845B]/10 text-[#27845B] border-[#27845B]/20 dark:bg-[#65C995]/15 dark:text-[#65C995] dark:border-[#65C995]/30"
                : currentStatus === "CANCELLED"
                ? "bg-[#C04452]/10 text-[#C04452] border-[#C04452]/20 dark:bg-[#F08089]/15 dark:text-[#F08089] dark:border-[#F08089]/30"
                : currentStatus === "SHIPPED"
                ? "bg-[#3568A8]/10 text-[#3568A8] border-[#3568A8]/20 dark:bg-[#8CB4EC]/15 dark:text-[#8CB4EC] dark:border-[#8CB4EC]/30"
                : currentStatus === "PROCESSING"
                ? "bg-[#A66A22]/10 text-[#A66A22] border-[#A66A22]/20 dark:bg-[#E6B66F]/15 dark:text-[#E6B66F] dark:border-[#E6B66F]/30"
                : "bg-[#DFE7F3] text-[#202C50] border-[#C9D5E7] dark:bg-[#34415B] dark:text-[#7895C5] dark:border-[#465570]"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Fulfillment: {currentStatus}</span>
          </span>
        </div>
      </div>

      {/* Order Title & Overview Card */}
      <div
        className={`rounded-2xl border p-6 shadow-sm transition-colors ${
          dark
            ? "border-[#35435C] bg-[#202A40]"
            : "border-[#D8E1EF] bg-white"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b dark:border-[#35435C] border-[#D8E1EF]">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1
                className={`text-2xl lg:text-3xl font-bold tracking-tight font-mono ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                #{order._id.slice(-8).toUpperCase()}
              </h1>
              <button
                type="button"
                onClick={handleCopyId}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-mono font-medium border transition-colors ${
                  dark
                    ? "border-[#465570] bg-[#171E30] text-[#AAB8D0] hover:text-[#EAF0FA]"
                    : "border-[#C9D5E7] bg-[#F7F9FC] text-[#64718A] hover:text-[#202C50]"
                }`}
                title="Copy full order ID"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#27845B] dark:text-[#65C995]" />
                    <span className="text-[#27845B] dark:text-[#65C995]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
            <div
              className={`flex items-center gap-3 text-xs mt-2 ${
                dark ? "text-[#8190AA]" : "text-[#64718A]"
              }`}
            >
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
              {formattedTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formattedTime}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-left lg:text-right">
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${
                  dark ? "text-[#8190AA]" : "text-[#64718A]"
                }`}
              >
                Order Total
              </p>
              <p
                className={`text-2xl lg:text-3xl font-black tracking-tight ${
                  dark ? "text-[#7895C5]" : "text-[#202C50]"
                }`}
              >
                {formatPrice.format(Number(order.totalAmount || 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Fulfillment Pipeline Progress Bar */}
        <div className="pt-6">
          <p
            className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
              dark ? "text-[#8190AA]" : "text-[#64718A]"
            }`}
          >
            Fulfillment Lifecycle
          </p>

          {currentStatus === "CANCELLED" ? (
            <div className="rounded-xl border border-[#C04452]/20 bg-[#C04452]/10 p-4 text-center text-sm font-semibold text-[#C04452] dark:text-[#F08089]">
              This order has been marked as cancelled.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STAGES.map((stage, idx) => {
                const isCompleted = stageIndex >= idx;
                const isCurrent = stageIndex === idx;

                return (
                  <div
                    key={stage.id}
                    className={`rounded-xl border p-3.5 transition-all flex flex-col gap-1.5 ${
                      isCurrent
                        ? dark
                          ? "border-[#7895C5] bg-[#34415B]/50 ring-2 ring-[#7895C5]/20"
                          : "border-[#202C50] bg-[#DFE7F3]/50 ring-2 ring-[#202C50]/15"
                        : isCompleted
                        ? dark
                          ? "border-[#35435C] bg-[#171E30]/60 opacity-90"
                          : "border-[#D8E1EF] bg-[#F7F9FC] opacity-90"
                        : dark
                        ? "border-[#35435C]/50 bg-transparent opacity-50"
                        : "border-[#D8E1EF]/60 bg-transparent opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          isCompleted
                            ? dark
                              ? "bg-[#7895C5] text-[#171E30]"
                              : "bg-[#202C50] text-white"
                            : dark
                            ? "bg-[#35435C] text-[#8190AA]"
                            : "bg-[#D8E1EF] text-[#64718A]"
                        }`}
                      >
                        {isCompleted ? "✓" : idx + 1}
                      </span>
                      {isCurrent && (
                        <span className="h-2 w-2 rounded-full bg-[#27845B] dark:bg-[#65C995] animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold leading-tight ${
                          isCurrent
                            ? dark
                              ? "text-[#EAF0FA]"
                              : "text-[#202C50]"
                            : dark
                            ? "text-[#AAB8D0]"
                            : "text-[#64718A]"
                        }`}
                      >
                        {stage.label}
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                        }`}
                      >
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols): Manage Fulfillment + Ordered Items + Payment Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Card: Update Fulfillment Status */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className={`text-base font-bold tracking-tight ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  Update Fulfillment
                </h2>
                <p
                  className={`text-xs mt-0.5 ${
                    dark ? "text-[#8190AA]" : "text-[#64718A]"
                  }`}
                >
                  Change the order fulfillment status to update customer tracking.
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-[#7895C5]" />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setStatusDraft({ orderId: id, status: e.target.value })
                }
                className={`flex-1 rounded-xl border p-2.5 text-sm font-medium outline-none transition-colors shadow-2xs ${
                  dark
                    ? "bg-[#171E30] border-[#465570] text-[#EAF0FA] focus:border-[#9BB2D8] focus:ring-2 focus:ring-[#9BB2D8]/20"
                    : "bg-white border-[#C9D5E7] text-[#202C50] focus:border-[#7895C5] focus:ring-2 focus:ring-[#7895C5]/20"
                }`}
              >
                <option value="PLACED">Placed (Recorded)</option>
                <option value="PROCESSING">Processing (Packing)</option>
                <option value="SHIPPED">Shipped (In transit)</option>
                <option value="DELIVERED">Delivered (Completed)</option>
                <option value="CANCELLED">Cancelled (Refund/Void)</option>
              </select>

              <button
                type="button"
                onClick={handleStatusSave}
                disabled={isUpdating || selectedStatus === currentStatus}
                className="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#202C50] text-white hover:bg-[#344F82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7895C5] dark:bg-[#7895C5] dark:text-[#171E30] dark:hover:bg-[#9BB2D8] dark:focus-visible:ring-[#9BB2D8] flex items-center justify-center gap-2 shadow-xs shrink-0"
              >
                {isUpdating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Status</span>
                  </>
                )}
              </button>
            </div>

            {statusSaved && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#27845B]/20 bg-[#27845B]/10 p-3 text-xs font-semibold text-[#27845B] dark:text-[#65C995]">
                <Check className="w-4 h-4" />
                <span>Order fulfillment status successfully updated to {currentStatus}.</span>
              </div>
            )}

            {updateError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#C04452]/20 bg-[#C04452]/10 p-3 text-xs font-semibold text-[#C04452] dark:text-[#F08089]">
                <AlertCircle className="w-4 h-4" />
                <span>{updateError.data?.message || "Could not update order status"}</span>
              </div>
            )}
          </section>

          {/* Card: Ordered Products Table */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-base font-bold tracking-tight ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                Ordered Items ({order.productDetails?.length || 0})
              </h2>
              <Package className="w-5 h-5 text-[#7895C5]" />
            </div>

            <div className="divide-y dark:divide-[#35435C]/60 divide-[#D8E1EF]">
              {(order.productDetails || []).map((item, index) => {
                const img =
                  item.images?.[0] ||
                  item.productImage?.[0] ||
                  (typeof item.productImage === "string" ? item.productImage : null);
                const title = item.name || item.productName || "Product";
                const unitPrice = Number(item.price || item.sellingPrice || 0);
                const quantity = Number(item.quantity || 1);
                const lineTotal = unitPrice * quantity;

                return (
                  <article
                    key={item.productId || index}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {img ? (
                        <img
                          src={img}
                          alt={title}
                          className={`h-14 w-14 rounded-xl object-cover shrink-0 border ${
                            dark
                              ? "border-[#35435C] bg-[#171E30]"
                              : "border-[#D8E1EF] bg-[#F7F9FC]"
                          }`}
                        />
                      ) : (
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-xl text-base font-bold shrink-0 ${
                            dark
                              ? "bg-[#171E30] text-[#7895C5] border border-[#35435C]"
                              : "bg-[#DFE7F3] text-[#202C50] border border-[#D8E1EF]"
                          }`}
                        >
                          {title.charAt(0) || "P"}
                        </div>
                      )}

                      <div className="min-w-0 flex flex-col">
                        <p
                          className={`text-sm font-semibold line-clamp-1 ${
                            dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                          }`}
                          title={title}
                        >
                          {title}
                        </p>
                        <div
                          className={`flex items-center gap-2 text-xs mt-1 ${
                            dark ? "text-[#8190AA]" : "text-[#64718A]"
                          }`}
                        >
                          <span>{formatPrice.format(unitPrice)} each</span>
                          <span>·</span>
                          <span
                            className={`rounded-md px-1.5 py-0.5 font-medium border ${
                              dark
                                ? "bg-[#171E30] text-[#AAB8D0] border-[#35435C]"
                                : "bg-[#F7F9FC] text-[#64718A] border-[#D8E1EF]"
                            }`}
                          >
                            Qty: {quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p
                      className={`text-sm sm:text-base font-bold text-right shrink-0 ${
                        dark ? "text-[#7895C5]" : "text-[#202C50]"
                      }`}
                    >
                      {formatPrice.format(lineTotal)}
                    </p>
                  </article>
                );
              })}
            </div>

            {/* Price Calculations Breakdown */}
            <div
              className={`mt-6 border-t pt-4 flex flex-col gap-2 text-xs sm:text-sm ${
                dark ? "border-[#35435C]" : "border-[#D8E1EF]"
              }`}
            >
              <div
                className={`flex justify-between ${
                  dark ? "text-[#8190AA]" : "text-[#64718A]"
                }`}
              >
                <span>Items Subtotal</span>
                <span>{formatPrice.format(itemsSubtotal)}</span>
              </div>
              <div
                className={`flex justify-between ${
                  dark ? "text-[#8190AA]" : "text-[#64718A]"
                }`}
              >
                <span>Shipping Fee</span>
                <span className="text-[#27845B] dark:text-[#65C995] font-semibold">
                  Free
                </span>
              </div>
              <div
                className={`flex justify-between items-center text-base font-bold pt-2 border-t mt-1 ${
                  dark
                    ? "border-[#35435C]/60 text-[#EAF0FA]"
                    : "border-[#D8E1EF] text-[#202C50]"
                }`}
              >
                <span>Total Amount</span>
                <span className="text-lg text-[#202C50] dark:text-[#7895C5]">
                  {formatPrice.format(Number(order.totalAmount || 0))}
                </span>
              </div>
            </div>
          </section>

          {/* Card: Payment & Stripe Transaction Info */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-base font-bold tracking-tight ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                Payment Information
              </h2>
              <CreditCard className="w-5 h-5 text-[#7895C5]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div
                className={`rounded-xl border p-3 flex flex-col gap-1 ${
                  dark
                    ? "border-[#35435C] bg-[#171E30]"
                    : "border-[#D8E1EF] bg-[#F7F9FC]"
                }`}
              >
                <span
                  className={`font-semibold uppercase tracking-wider text-[10px] ${
                    dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                  }`}
                >
                  Payment Status
                </span>
                <span
                  className={`font-bold capitalize text-sm ${
                    isPaid
                      ? "text-[#27845B] dark:text-[#65C995]"
                      : "text-[#A66A22] dark:text-[#E6B66F]"
                  }`}
                >
                  {order.paymentDetails?.payment_status || "Pending"}
                </span>
              </div>

              <div
                className={`rounded-xl border p-3 flex flex-col gap-1 ${
                  dark
                    ? "border-[#35435C] bg-[#171E30]"
                    : "border-[#D8E1EF] bg-[#F7F9FC]"
                }`}
              >
                <span
                  className={`font-semibold uppercase tracking-wider text-[10px] ${
                    dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                  }`}
                >
                  Gateway
                </span>
                <span
                  className={`font-bold text-sm ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  Stripe Checkout
                </span>
              </div>

              {order.stripeCheckoutSessionId && (
                <div
                  className={`sm:col-span-2 rounded-xl border p-3 flex flex-col gap-1 ${
                    dark
                      ? "border-[#35435C] bg-[#171E30]"
                      : "border-[#D8E1EF] bg-[#F7F9FC]"
                  }`}
                >
                  <span
                    className={`font-semibold uppercase tracking-wider text-[10px] ${
                      dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                    }`}
                  >
                    Stripe Session Reference
                  </span>
                  <span className="font-mono text-xs break-all text-[#64718A] dark:text-[#AAB8D0]">
                    {order.stripeCheckoutSessionId}
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column (1 Col): Customer Profile & Shipping Logistics */}
        <div className="flex flex-col gap-6">
          {/* Card: Customer Details */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-base font-bold tracking-tight ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                Customer Details
              </h2>
              <User className="w-5 h-5 text-[#7895C5]" />
            </div>

            <div className="flex items-center gap-3 pb-4 border-b dark:border-[#35435C] border-[#D8E1EF]">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-sm shrink-0 ${
                  dark
                    ? "bg-[#34415B] text-[#7895C5]"
                    : "bg-[#DFE7F3] text-[#202C50]"
                }`}
              >
                {order.email ? order.email.charAt(0).toUpperCase() : "C"}
              </div>
              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  {shippingAddress.name || "Customer"}
                </p>
                <p
                  className={`text-xs truncate ${
                    dark ? "text-[#8190AA]" : "text-[#64718A]"
                  }`}
                >
                  User ID: {order.userId ? order.userId.slice(-6) : "Guest"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#7895C5] shrink-0" />
                <a
                  href={`mailto:${order.email}`}
                  className={`truncate hover:underline ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  {order.email || "No email provided"}
                </a>
              </div>

              {shippingAddress.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#7895C5] shrink-0" />
                  <a
                    href={`tel:${shippingAddress.phone}`}
                    className={`hover:underline ${
                      dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                    }`}
                  >
                    {shippingAddress.phone}
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Card: Delivery & Shipping Address */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors ${
              dark
                ? "border-[#35435C] bg-[#202A40]"
                : "border-[#D8E1EF] bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-base font-bold tracking-tight ${
                  dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                }`}
              >
                Shipping Address
              </h2>
              <MapPin className="w-5 h-5 text-[#7895C5]" />
            </div>

            {address.line1 ? (
              <address
                className={`flex flex-col gap-1 not-italic text-xs sm:text-sm leading-relaxed ${
                  dark ? "text-[#8190AA]" : "text-[#64718A]"
                }`}
              >
                {shippingAddress.name && (
                  <p
                    className={`font-semibold ${
                      dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                    }`}
                  >
                    {shippingAddress.name}
                  </p>
                )}
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>
                  {[
                    address.city,
                    address.state,
                    address.postal_code,
                    address.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {shippingAddress.phone && (
                  <p className="mt-2 text-xs">
                    <span className="font-semibold">Phone: </span>
                    {shippingAddress.phone}
                  </p>
                )}
              </address>
            ) : (
              <p
                className={`text-xs ${
                  dark ? "text-[#8190AA]" : "text-[#64718A]"
                }`}
              >
                No physical shipping address was registered for this checkout.
              </p>
            )}
          </section>

          {/* Card: Order Meta Details */}
          <section
            className={`rounded-2xl border p-5 shadow-sm transition-colors text-xs ${
              dark
                ? "border-[#35435C] bg-[#202A40] text-[#8190AA]"
                : "border-[#D8E1EF] bg-white text-[#64718A]"
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Order Placement</span>
                <span
                  className={`font-semibold ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  {formattedDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Confirmation</span>
                <span
                  className={`font-semibold ${
                    isPaid
                      ? "text-[#27845B] dark:text-[#65C995]"
                      : "text-[#A66A22] dark:text-[#E6B66F]"
                  }`}
                >
                  {isPaid ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Customer Type</span>
                <span
                  className={`font-semibold ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  {order.userId ? "Registered User" : "Guest Checkout"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminOrderDetails;
