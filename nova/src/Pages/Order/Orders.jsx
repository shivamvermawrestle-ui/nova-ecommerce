import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import { useGetOrdersQuery } from "../../services/productsApi";
import OrderStatusSteps from "../../Components/Order/OrderStatusSteps";

const Orders = () => {
  const { formatPrice, dark } = UseGlob();
  const { data: orders = [], isLoading, isError, error } = useGetOrdersQuery();

  if (isLoading) {
    return <p className={`px-6 py-16 text-center text-sm ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>Loading orders...</p>;
  }

  if (isError) {
    return (
      <main className="px-6 py-16 text-center">
        <p className={`text-base font-semibold ${dark ? "text-[#EAF0FA]" : "text-[#202C50]"}`}>
          {error.status === 401 ? "Log in to view your orders." : "Could not load orders."}
        </p>
        {error.status === 401 && (
          <Link
            to="/login"
            className={`mt-4 inline-block px-5 py-2.5 rounded-xl font-bold text-sm text-center transition-colors ${
              dark
                ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                : "bg-[#202C50] text-white hover:bg-[#344F82]"
            }`}
          >
            Log in
          </Link>
        )}
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="px-6 py-16 text-center">
        <h1 className={`text-2xl font-bold ${dark ? "text-[#EAF0FA]" : "text-[#202C50]"}`}>No orders yet</h1>
        <p className={`mt-2 text-sm ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>You haven't placed any orders with us yet.</p>
        <Link
          to="/shop"
          className={`mt-5 inline-block px-5 py-2.5 rounded-xl font-bold text-sm text-center transition-colors ${
            dark
              ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
              : "bg-[#202C50] text-white hover:bg-[#344F82]"
          }`}
        >
          Browse the Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex flex-col gap-6 max-w-5xl px-4 sm:px-6 py-10">
      <div>
        <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${dark ? "text-[#EAF0FA]" : "text-[#202C50]"}`}>
          Your Orders
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
          Track and manage your past purchases
        </p>
      </div>

      <section className="flex flex-col gap-4">
        {orders.map((order) => (
          <article
            key={order._id}
            className={`p-5 sm:p-6 rounded-2xl border shadow-sm flex flex-col gap-4 transition-colors ${
              dark
                ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
                : "border-[#D8E1EF] bg-white text-[#202C50]"
            }`}
          >
            <OrderStatusSteps status={order.orderStatus || "PLACED"} />

            <div className={`flex flex-wrap justify-between gap-3 border-b pb-4 ${dark ? "border-[#35435C]" : "border-[#D8E1EF]"}`}>
              <div>
                <p className="font-bold text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className={`text-xs mt-0.5 ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className={`font-black text-base ${dark ? "text-[#7895C5]" : "text-[#202C50]"}`}>
                  {formatPrice.format(order.totalAmount || 0)}
                </p>
                <p className={`text-xs capitalize ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
                  {order.paymentDetails?.payment_status || "Pending"} · {order.orderStatus || "PLACED"}
                </p>
              </div>
            </div>

            <Link
              to={`/orders/${order._id}`}
              className={`self-start rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                dark
                  ? "border-[#35435C] bg-[#171E30] text-[#7895C5] hover:bg-[#2D3B56]"
                  : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50] hover:bg-[#EDF2F9]"
              }`}
            >
              View order details →
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Orders;
