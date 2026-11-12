import { Link, useParams } from "react-router-dom"
import { UseGlob } from "../../Context/GlobalContext"
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation } from "../../services/productsApi"
import { useEffect, useState } from "react"

const AdminOrderDetails = () => {
  const { id } = useParams()
  const { formatPrice } = UseGlob()
    const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useGetAdminOrdersQuery()
      const order = orders.find((item) => item._id === id)
  const currentStatus=order?.orderStatus || "PLACED"
const [selectedStatus, setSelectedStatus] = useState(currentStatus)

    useEffect(()=>{
setSelectedStatus(currentStatus)
    },[id,currentStatus])
    const [updateOrderStatus,
    {isLoading:isUpdating,
    error:updateError}]=useUpdateOrderStatusMutation()

    const shippingAddress=order?.shippingAddress || {}
    const address= shippingAddress.address || {}

  if (isLoading) return <p className="p-6">Loading order...</p>

  if (isError) {
    return (
      <p className="p-6 text-red-600">
        {error?.data?.message || "Could not load order."}
      </p>
    )
  }

    const handleStatusSave=async ()=>{
        if(!order || selectedStatus === currentStatus)
            return 
        try{
            await updateOrderStatus({orderId:order._id,orderStatus:selectedStatus}).unwrap()
        }catch(error){
            console.error("Order status update failed:",error)
        }
    }
  if (!order) return <p className="p-6">Order not found.</p>

  return (
    <main className="space-y-6 p-6">
      <Link to="/dashboard/orders" className="underline">
        ← Back to orders
      </Link>

      <div>
        <p className="text-sm text-stone-500">
          Order #{order._id.slice(-8).toUpperCase()}
        </p>
        <h1 className="text-2xl font-semibold">Order details</h1>
      </div>

      <section className="grid gap-4 rounded-xl bg-stone-100 p-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-stone-500">Customer</p>
          <p>{order.email || "—"}</p>
        </div>

        <div>
          <p className="text-sm text-stone-500">Payment status</p>
          <p>{order.paymentDetails?.payment_status || "Pending"}</p>
        </div>

        <div>
          <p className="text-sm text-stone-500">Order total</p>
          <p>{formatPrice.format(Number(order.totalAmount || 0))}</p>
        </div>
      </section>
<section className="rounded-xl p-4 border ">
    <h2>Fullfillment status</h2>

    <div className="flex flex-wrap items-center gap-2 ">
        <select value={selectedStatus} onChange={(e)=>setSelectedStatus(e.target.value)} className="rounded-lg border p-2">
            <option value="PLACED">Placed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
        </select>
<button onClick={handleStatusSave} disabled={isUpdating || selectedStatus === currentStatus} className="bg-stone-900 text-white px-4 py-2 rounded-xl disabled:opacity-50">{isUpdating?"Saving...":"Save status"} </button>
{updateError && (
    <p>{updateError.data?.message || "Could not update order status"}</p>
)}
    </div>

</section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Items</h2>

        <div className="space-y-3">
          {(order.productDetails || []).map((item, index) => (
            <article
              key={item.productId || index}
              className="flex items-center justify-between gap-4 rounded-xl border p-4"
            >
              <div>
                <p className="font-medium">
                  {item.name || item.productName || "Product"}
                </p>
                <p className="text-sm text-stone-500">
                  Quantity: {item.quantity || 0}
                </p>
              </div>

              <p>
                {formatPrice.format(
                  Number(item.price || 0) * Number(item.quantity || 0)
                )}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <h2>Shipping address</h2>
        {address.line1 ?(
            <address className="flex flex-col gap-1 text-stone-700">
                {shippingAddress.name && <p>{shippingAddress.name}</p>}
                <p>{address.line1}</p>

                {address.line2 && <p>{address.line2}</p>}
                <p>{[address.city,address.state,address.postal_code,address.country].filter(Boolean).join(",")}</p>

                {shippingAddress.phone && <p>Phone:{shippingAddress.phone}</p>}

            </address>
        ):(
            <p>No shipping address saved for this order</p>
        )}
      </section>
    </main>
  )
}

export default AdminOrderDetails

