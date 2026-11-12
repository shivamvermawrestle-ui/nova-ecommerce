import { Link } from "react-router-dom"
import { UseGlob } from "../../Context/GlobalContext"
import { useGetAdminOrdersQuery } from "../../services/productsApi"
import { useState } from "react"

const AdminOrders = () => {
    const {formatPrice}=UseGlob()
    const {data:orders=[],isLoading,
        isError,
        error
    }=useGetAdminOrdersQuery()


const [search, setSearch] = useState("")
const [statusFilter, setStatusFilter] = useState("ALL")

const normalizedSearch = search.trim().toLowerCase()

const filteredOrders = orders.filter((order) => {
  const matchesSearch =
    order._id.toLowerCase().includes(normalizedSearch) ||
    (order.email || "").toLowerCase().includes(normalizedSearch)

  const matchesStatus =
    statusFilter === "ALL" ||
    (order.orderStatus || "PLACED") === statusFilter

  return matchesSearch && matchesStatus
})
    if(isLoading){
        return <p>Loading orders...</p>
    }
    if(isError){
        return <p>{error?.data?.message || "Could not load orders."}</p>
    }
  return (
<>
<main className="p-4">
    <h1>Orders</h1>
    <div className="grid gap-2 sm:grid-cols-2">
        <input 
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        placeholder="Search order ID or customer email"
        className="rounded-xl  border p-2"
        />
<select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="rounded-xl border p-2">
<option value="ALL">All fulfillment statuses </option>
<option value="PLACED">Placed</option>
<option value="PROCESSING">Processing</option>
<option value="SHIPPED">Shipped</option>
<option value="DELIVERED">Delivered</option>
<option value="CANCELLED">Cancelled</option>
</select>
    </div>
    {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
    ):(
        <div className="overflow-auto ">
             <table className="w-full min-w-[700px]  text-center border-collapse">
                <thead>
                    <tr className="border-b text-sm font-medium">
                        <th className="p-2">Order</th>
                        <th className="p-2">Customer</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Payment status</th>
                        <th className="p-2">Fulfillment</th>
                        <th className="p-2">Total</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
<tbody>
{filteredOrders.map((order)=>(
    <tr key={order._id} className="border-b">

        <td className="p-2">{order._id.slice(-8).toUpperCase()}</td>
        <td className="p-2">{order.email || "-"}</td>
        <td className="p-2">{order.createdAt?new Date(order.createdAt).toLocaleDateString():"-"}</td>
        <td className="p-2">{order.paymentDetails?.payment_status || "Pending"}</td>
        <td className="p-2">{order.orderStatus || "PLACED"}</td>
        <td className="p-2">{formatPrice.format(Number(order.totalAmount || 0))}</td>
        <td><Link to={`/dashboard/orders/${order._id}`} className="py-1 px-2 rounded-full text-xs bg-stone-900 text-white">View</Link></td>
    </tr>
))}
</tbody>

            </table>


        </div>
    )}

</main>
</>
  )
}

export default AdminOrders

