import { Link } from "react-router-dom"
import { UseGlob } from "../../Context/GlobalContext"
import { useGetOrdersQuery } from "../../services/productsApi"
import OrderStatusSteps from "../../Components/Order/OrderStatusSteps"


const Orders = () => {
    const  {formatPrice}=UseGlob()
     const {data:orders=[],isLoading,isError,error}=useGetOrdersQuery()
     if(isLoading){
        return <p>Loading orders...</p>
     }
     if(isError){
        return (
            <main className="px-6 py-16 text-center">
                <p>{error.status===401?'Login in to view your orders':'Could not load orders.'}</p>
                {error.status===401 && 
                <Link to={'/login'} className="underline px-4 py-2 bg-stone-900 text-white text-center rounded-xl" >Login</Link>
                }
            </main>
        )
     }

if(orders.length === 0){
    return(
      <main className="px-6 py-16 text-center">
<h1>No orders yet</h1>
<Link to={'/shop'} className="px-4 py-2 bg-stone-900 text-white rounded-xl text-center"> Browse the Shop</Link>
        </main>
    )
}


  return (
<>
<main className="mx-auto  flex flex-col bg-gray-200  gap-4 max-w-5xl px-6 py-12">

<section className="flex flex-col gap-4">
    <h1>Your orders</h1>
{
    orders.map((order)=>(
        <article key={order._id} className=" p-4  bg-white rounded-xl shadow-sm flex flex-col gap-2 "> 
        <OrderStatusSteps status={order.orderStatus || "PLACED"} />
<div className="flex flex-wrap justify-between gap-2 border-b pb-4">
    <div>
        <p>Order #{order._id.slice(-8)}</p>
        <p className="text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</p>
    </div>
    <div>
<p>{formatPrice.format(order.totalAmount || 0)}</p>
<p>{order.paymentDetails?.payment_status || 'Pending'}</p>
<p>{order.orderStatus || 'PLACED'}</p>
    </div>
</div>

<Link
  to={`/orders/${order._id}`}
  className="self-start rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50"
>
  View order details
</Link>
        </article>
    ))
    
}
</section>
</main>
</>
  )
}

export default Orders

