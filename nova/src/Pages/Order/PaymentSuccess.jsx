import { Link, useSearchParams } from "react-router-dom";
import { useGetCheckoutConfirmationQuery } from "../../services/productsApi";
import { useEffect, useState } from "react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [pollingEnabled, setPollingEnabled] = useState(true)
  const { data, isLoading, isError, error, isFetching, refetch } =
    useGetCheckoutConfirmationQuery(sessionId, {
      skip: !sessionId,
      pollingInterval:({data,error})=> pollingEnabled && !data?.success && !error  ? 2500:0
    });
useEffect(()=>{
  if(!sessionId || !pollingEnabled || data?.success || isError){
    return
  }
  const timeoutId=window.setTimeout(()=>{
    setPollingEnabled(false)
  },30_000)
  return ()=>window.clearTimeout(timeoutId)
},[sessionId,pollingEnabled,data?.success,isError])
const checkStatus=()=>{
  setPollingEnabled(true)
  refetch()
}
  const order = data?.data;

  return (
    <>
      <main className="mx-auto max-w-2xl flex flex-col  gap-4  px-6 py-20 text-center">
        {!sessionId ? (
          <>
            <h1>Order not found</h1>
            <p>This page is missing the checkout session ID.</p>
          </>
        ) : isLoading ? (
          <p>Checking your payment and order...</p>
        ) : isError ? (
          <>
            <h1>Could not check your order</h1>
            <p>
              {error?.status === 401
                ? "Log in to view your order."
                : error?.data?.message || "Please try checking again."}
            </p>
            {error?.status === 401 ? (
              <Link
                to="/login"
                className="bg-black text-white px-4 py-2 text-center rounded-xl"
              >
                Login
              </Link>
            ) : (
              <button
                type="button"
                onClick={checkStatus}
                disabled={isFetching}
                className="rounded-xl bg-black text-white py-2 px-4 text-center"
              >
                {isFetching ? "Checking..." : "Try again"}
              </button>
            )}
          </>
        ) : data?.success && order ? (
          <>
            <p>Checkout update</p>
            <h1>
              {order.orderStatus === "CANCELLED"
                ? "Order cancelled"
                : "Order confirmed"}
            </h1>
            <p>
              Order #{order._id.slice(-8)} · Payment:{" "}
              {order.paymentDetails?.payment_status}
            </p>
            <p>Total: ₹{Number(order.totalAmount).toLocaleString("en-IN")}</p>
          </>
        ) : (
          <>
            <h1>Confirming your order</h1>
            <p>
              Payment confirmation is still processing.Check again in a moment.
            </p>
            <button
              type="button"
              onClick={ checkStatus}
              disabled={isFetching}
              className="rounded-xl bg-black text-white py-2 px-4 text-center"
            >
              {isFetching ? "Checking..." : "Check status"}
            </button>
            <p>{pollingEnabled?"Confirmation pending.We are checking automatically.":"Confirmation is taking longer.You can check again manually."}</p>
          </>
        )}

        <div className="flex justify-center items-center gap-4">
          <Link to={order?`/orders/${order._id}`:"/orders"}>{order?"View this order" :"My orders"}</Link>
          <Link
            to="/shop"
            className="px-4 py-2 rounded-xl text-center bg-stone-900 text-white"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    </>
  );
};

export default PaymentSuccess;

