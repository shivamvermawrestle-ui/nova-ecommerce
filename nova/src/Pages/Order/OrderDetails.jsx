import { Link, useParams } from "react-router-dom"
import { UseGlob } from "../../Context/GlobalContext"
import { useGetUserOrderByIdQuery } from "../../services/productsApi"
import OrderStatusSteps from "../../Components/Order/OrderStatusSteps"


const OrderDetails = () => {
    const params=useParams()
    const id = params.id
    const {formatPrice}=UseGlob()
    const {
        data:order,
        isLoading,
        isError,
        error,
    }=useGetUserOrderByIdQuery(id,{
        skip:!id
    })
    if(isLoading){
        return <p>Loading order...</p>
    }
    if(isError || !order){
return(
    <main className="px-6 py-12 flex flex-col items-center justify-center gap-4">
        <h1>Could not load this order</h1>
     <p>{error?.data?.message || (error?.status===401 ?"Log in to view this order.":"Order not found.")}</p>
     {error?.status ===401 && (
        <Link to="/login" className="px-4 py-2 text-center bg-black text-white rounded-xl">Login</Link>
     )}
             <Link to="/orders" className="px-4 py-2 text-center border-2 text-black rounded-xl">Back to my orders</Link>

    </main>
)
    }
    const address =order.shippingAddress?.address
  return (
<>
    <main className="mx-auto max-w-4xl px-6 py-12">
     <Link to="/orders" className="px-4 py-2 text-center border-2 text-black rounded-xl">Back to my orders</Link>

       <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap justify-between gap-4 border-b pb-5">
          <div>
            <h1 className="text-2xl font-semibold">
              Order #{order._id.slice(-8)}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Placed {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <p className="font-medium">{order.orderStatus || "PLACED"}</p>
            <p className="mt-1 text-sm text-stone-500">
              Payment: {order.paymentDetails?.payment_status || "Pending"}
            </p>
          </div>
        </div>

<section className="border-b py-4">
    <h2 className="text-lg font-semibold">Order progress</h2>

    <OrderStatusSteps status={order.orderStatus || "PLACED"}/>
</section>
        <section className="py-5">
          <h2 className="mb-4 text-lg font-semibold">Items</h2>

          <div className="divide-y">
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
                      className="h-20 w-20 rounded-lg object-contain"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-stone-500">
                      {formatPrice.format(unitPrice)} each · Qty {quantity}
                    </p>
                  </div>

                  <p className="font-medium">
                    {formatPrice.format(unitPrice * quantity)}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 border-t pt-5 sm:grid-cols-2">
          <div>
            <h2 className="font-semibold">Shipping address</h2>
            {address?.line1 ? (
              <address className="mt-2 not-italic text-sm text-stone-600">
                {order.shippingAddress.name && (
                  <p>{order.shippingAddress.name}</p>
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
              <p className="mt-2 text-sm text-stone-500">
                No shipping address was saved.
              </p>
            )}
          </div>

          <div className="sm:text-right">
            <h2 className="font-semibold">Order total</h2>
            <p className="mt-2 text-xl font-semibold">
              {formatPrice.format(Number(order.totalAmount || 0))}
            </p>
          </div>
        </section>
      </section>
    </main>

</>
  )
}

export default OrderDetails

