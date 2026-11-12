import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import { useGetAdminOrdersQuery } from "../../services/productsApi";

const AdminDashboard = () => {
  const { formatPrice } = UseGlob();
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useGetAdminOrdersQuery();
  if (isLoading) {
    return <p>Loading dashboard</p>;
  }
  if (isError) {
    return (
      <main>
        <p>{error?.data?.message || "Could not  load dashboard data."}</p>
      </main>
    );
  }

  const paidOrders = orders.filter(
    (order) => order.paymentDetails?.payment_status === "paid",
  );

  const revenue = paidOrders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0,
  );
  const pendingOrders = orders.filter((order) =>
    ["PLACED", "PROCESSING"].includes(order.orderStatus || "PLACED"),
  );
  return (
    <>
      <main className="mx-auto max-w-7xl flex  p-6">
        <div className="flex flex-col gap-4">
          <div>
            <p>Nook Admin</p>
            <h1>Overview</h1>
          </div>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-xl bg-stone-100 p-5">
              <p>All orders</p>
              <p className="mt-2 text-2xl font-semibold">{orders.length}</p>
            </article>

            <article className="rounded-xl bg-stone-100 p-5">
              <p>Awaiting fulfillment</p>
              <p className="mt-2 text-2xl font-semibold">
                {pendingOrders.length}
              </p>
            </article>

            <article className="rounded-xl bg-stone-100 p-5">
              <p>Paid revenue</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatPrice.format(revenue)}
              </p>
            </article>
          </section>

          <section className="p-4 flex flex-col w-full gap-4">
            <div className="flex w-full  items-center  justify-between ">
              <h2>Recent orders</h2>
              <Link
                to={"/dashboard/orders"}
                className="text-sm hover:underline"
              >
                View all
              </Link>
            </div>

            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <div className="overflow-auto rounded-xl shadow-md p-4">
                <table className=" min-w-[700px]  text-center border-collapse">
                  <thead>
                    <tr className="border-b text-sm font-medium">
                      <th className="p-2">Order</th>
                      <th className="p-2">Customer</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Fulfillment</th>
                      <th className="p-2">Total</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id} className="border-b">
                        <td className="p-2">
                          {order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="p-2">{order.email || "-"}</td>
                        <td className="p-2">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="p-2">{order.orderStatus || "PLACED"}</td>
                        <td className="p-2">
                          {formatPrice.format(Number(order.totalAmount || 0))}
                        </td>
                        <td>
                          <Link
                            to={`/dashboard/orders/${order._id}`}
                            className="py-1 px-2 rounded-full text-xs bg-stone-900 text-white"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;

