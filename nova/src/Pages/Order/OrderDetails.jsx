import { Link, useParams } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import { useGetUserOrderByIdQuery } from "../../services/productsApi";
import OrderStatusSteps from "../../Components/Order/OrderStatusSteps";

const OrderDetails = () => {
  const params = useParams();
  const id = params.id;
  const { formatPrice, dark } = UseGlob();
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetUserOrderByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return <p className={`p-12 text-center text-sm ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>Loading order...</p>;
  }

  if (isError || !order) {
    return (
      <main className="px-6 py-16 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className={`text-2xl font-bold ${dark ? "text-[#EAF0FA]" : "text-[#202C50]"}`}>Could not load this order</h1>
        <p className={`text-sm ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
          {error?.data?.message || (error?.status === 401 ? "Log in to view this order." : "Order not found.")}
        </p>
        {error?.status === 401 && (
          <Link
            to="/login"
            className={`px-5 py-2.5 text-center font-bold text-sm rounded-xl transition-colors ${
              dark
                ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                : "bg-[#202C50] text-white hover:bg-[#344F82]"
            }`}
          >
            Login
          </Link>
        )}
        <Link
          to="/orders"
          className={`px-4 py-2 text-center rounded-xl border text-sm font-semibold transition-colors ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#7895C5]"
              : "border-[#D8E1EF] bg-white text-[#202C50]"
          }`}
        >
          Back to my orders
        </Link>
      </main>
    );
  }

  const address = order.shippingAddress?.address;

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <Link
        to="/orders"
        className={`inline-block px-4 py-2 text-center rounded-xl border text-sm font-semibold transition-colors ${
          dark
            ? "border-[#35435C] bg-[#202A40] text-[#7895C5] hover:bg-[#2D3B56]"
            : "border-[#D8E1EF] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
        }`}
      >
        ← Back to my orders
      </Link>

      <section
        className={`mt-6 rounded-3xl border p-6 sm:p-8 shadow-sm transition-colors ${
          dark
            ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
            : "border-[#D8E1EF] bg-white text-[#202C50]"
        }`}
      >
        <div className={`flex flex-wrap justify-between gap-4 border-b pb-5 ${dark ? "border-[#35435C]" : "border-[#D8E1EF]"}`}>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className={`mt-1 text-xs sm:text-sm ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#27845B]/15 text-[#27845B] dark:text-[#65C995]">
              {order.orderStatus || "PLACED"}
            </span>
            <p className={`mt-1.5 text-xs ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
              Payment: {order.paymentDetails?.payment_status || "Pending"}
            </p>
          </div>
        </div>

        <section className={`border-b py-5 ${dark ? "border-[#35435C]" : "border-[#D8E1EF]"}`}>
          <h2 className="text-base font-bold mb-4">Order progress</h2>
          <OrderStatusSteps status={order.orderStatus || "PLACED"} />
        </section>

        <section className="py-5">
          <h2 className="mb-4 text-base font-bold">Items</h2>

          <div className={`divide-y ${dark ? "divide-[#35435C]/60" : "divide-[#D8E1EF]"}`}>
            {(order.productDetails || []).map((item, index) => {
              const quantity = Number(item.quantity || 0);
              const unitPrice = Number(item.price || 0);

              return (
                <article
                  key={`${order._id}-${index}`}
                  className="flex items-center gap-4 py-4"
                >
                  {item.images?.[0] && (
                    <img
                      src={item.images[0]}
                      alt={item.name || "Ordered product"}
                      className={`h-20 w-20 rounded-xl object-cover border ${
                        dark
                          ? "border-[#35435C] bg-[#171E30]"
                          : "border-[#D8E1EF] bg-[#F7F9FC]"
                      }`}
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                    <p className={`text-xs mt-1 ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
                      {formatPrice.format(unitPrice)} each · Qty {quantity}
                    </p>
                  </div>

                  <p className={`font-bold text-sm sm:text-base ${dark ? "text-[#7895C5]" : "text-[#202C50]"}`}>
                    {formatPrice.format(unitPrice * quantity)}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className={`grid gap-6 border-t pt-5 sm:grid-cols-2 ${dark ? "border-[#35435C]" : "border-[#D8E1EF]"}`}>
          <div>
            <h2 className="font-bold text-sm">Shipping address</h2>
            {address?.line1 ? (
              <address className={`mt-2 not-italic text-xs sm:text-sm leading-relaxed ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
                {order.shippingAddress.name && (
                  <p className="font-semibold">{order.shippingAddress.name}</p>
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
              </address>
            ) : (
              <p className={`mt-2 text-xs sm:text-sm ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
                No shipping address was saved.
              </p>
            )}
          </div>

          <div className="sm:text-right">
            <h2 className="font-bold text-sm">Order total</h2>
            <p className={`mt-2 text-2xl font-black ${dark ? "text-[#7895C5]" : "text-[#202C50]"}`}>
              {formatPrice.format(Number(order.totalAmount || 0))}
            </p>
          </div>
        </section>
      </section>
    </main>
  );
};

export default OrderDetails;
