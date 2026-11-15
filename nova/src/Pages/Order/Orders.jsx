import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import { useGetOrdersQuery } from "../../services/productsApi";
import OrderStatusSteps from "../../Components/Order/OrderStatusSteps";

const Orders = () => {
  const { formatPrice, dark } = UseGlob();

  const { data: orders = [], isLoading, isError, error } = useGetOrdersQuery();

  // Theme styles
  const pageBg = dark ? "bg-[#171E30]" : "bg-[#F7F9FC]";
  const cardBg = dark ? "bg-[#202A40]" : "bg-white";

  const textPrimary = dark ? "text-[#EAF0FA]" : "text-[#202C50]";
  const textSecondary = dark ? "text-[#AAB8D0]" : "text-[#64718A]";

  const borderColor = dark ? "border-[#35435C]" : "border-[#D8E1EF]";

  const accentText = dark ? "text-[#7895C5]" : "text-[#344F82]";

  const primaryButton = dark
    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
    : "bg-[#202C50] text-white hover:bg-[#344F82]";

  const secondaryButton = dark
    ? "border-[#35435C] bg-[#171E30] text-[#7895C5] hover:bg-[#2D3B56]"
    : "border-[#D8E1EF] bg-[#F7F9FC] text-[#344F82] hover:bg-[#EDF2F9]";

  const errorText = dark ? "text-[#F08089]" : "text-[#C04452]";

  // Loading State
  if (isLoading) {
    return (
      <main
        className={`${pageBg} min-h-screen flex items-center justify-center`}
      >
        <p className={`px-6 py-16 text-center text-sm ${textSecondary}`}>
          Loading orders...
        </p>
      </main>
    );
  }

  // Error State
  if (isError) {
    return (
      <main
        className={`${pageBg} min-h-[70vh] px-6 py-16 flex flex-col items-center justify-center text-center`}
      >
        <p className={`text-base font-semibold ${textPrimary}`}>
          {error?.status === 401
            ? "Log in to view your orders."
            : "Could not load orders."}
        </p>

        {error?.status === 401 && (
          <Link
            to="/login"
            className={`mt-4 inline-block px-5 py-2.5 rounded-xl font-bold text-sm text-center transition-colors ${primaryButton}`}
          >
            Log in
          </Link>
        )}

        {error?.status !== 401 && (
          <p className={`mt-2 text-sm ${errorText}`}>
            {error?.data?.message || "Please try again later."}
          </p>
        )}
      </main>
    );
  }

  // Empty Orders
  if (orders.length === 0) {
    return (
      <main
        className={`${pageBg} min-h-[70vh] px-6 py-16 flex flex-col items-center justify-center text-center`}
      >
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${borderColor} ${cardBg} ${accentText}`}
        >
          <span className="text-3xl">📦</span>
        </div>

        <h1 className={`mt-5 text-2xl font-bold ${textPrimary}`}>
          No orders yet
        </h1>

        <p className={`mt-2 text-sm ${textSecondary}`}>
          You haven't placed any orders with us yet.
        </p>

        <Link
          to="/shop"
          className={`mt-5 inline-block px-5 py-2.5 rounded-xl font-bold text-sm text-center transition-colors ${primaryButton}`}
        >
          Browse the Shop
        </Link>
      </main>
    );
  }

  return (
    <main className={`${pageBg} min-h-screen transition-colors duration-200`}>
      <div className="mx-auto flex flex-col gap-6 max-w-5xl px-4 sm:px-6 py-10">
        {/* Page Header */}
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimary}`}
          >
            Your Orders
          </h1>

          <p className={`text-xs sm:text-sm mt-1 ${textSecondary}`}>
            Track and manage your past purchases
          </p>
        </div>

        {/* Orders List */}
        <section className="flex flex-col gap-4">
          {orders.map((order) => (
            <article
              key={order._id}
              className={`p-5 sm:p-6 rounded-2xl border shadow-sm flex flex-col gap-4 transition-colors ${cardBg} ${borderColor} ${textPrimary}`}
            >
              {/* Order Status Steps */}
              <OrderStatusSteps status={order.orderStatus || "PLACED"} />

              {/* Order Information */}
              <div
                className={`flex flex-wrap justify-between gap-3 border-b pb-4 ${borderColor}`}
              >
                <div>
                  <p className="font-bold text-sm">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>

                  <p className={`text-xs mt-0.5 ${textSecondary}`}>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`font-black text-base ${accentText}`}>
                    {formatPrice.format(order.totalAmount || 0)}
                  </p>

                  <p className={`text-xs capitalize ${textSecondary}`}>
                    {order.paymentDetails?.payment_status || "Pending"} ·{" "}
                    {order.orderStatus || "PLACED"}
                  </p>
                </div>
              </div>

              {/* View Order Details */}
              <Link
                to={`/orders/${order._id}`}
                className={`self-start rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${secondaryButton}`}
              >
                View order details →
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default Orders;
