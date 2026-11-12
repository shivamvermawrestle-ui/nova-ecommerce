import { Link } from "react-router-dom"

const PaymentCancel = () => {
  return (
<>
<main className="mx-auto max-w-2xl px-6 py-20 text-center">
    <p>Checkout cancelled </p>
    <h1>Your cart still saved</h1>
    <p>You can return your cart and try checkout again whenever you're ready.</p>

    <Link to='/cart' className="px-4 py-2 text-center bg-stone-900 
">Return to cart</Link>
   

</main>
</>
  )
}

export default PaymentCancel

