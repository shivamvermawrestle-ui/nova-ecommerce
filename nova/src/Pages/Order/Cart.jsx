import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useCreatePaymentSessionMutation,
  useDeleteCartProductMutation,
  useGetCartQuery,
  useUpdateCartProductMutation,
} from "../../services/productsApi";
import { UseGlob } from "../../Context/GlobalContext";
import { Minus, Plus } from "lucide-react";

const Cart = () => {
  const { data: items = [], isLoading, isError, error } = useGetCartQuery();
  const { navigate, formatPrice } = UseGlob();
  const [updateCartProduct] = useUpdateCartProductMutation();
  const [deleteCartProduct] = useDeleteCartProductMutation();
  const [createPaymentSession, { isLoading: IsCheckingOut }] =
    useCreatePaymentSessionMutation();
  const [checkoutError, setCheckoutError] = useState("");

  const handleCheckout = async () => {
    try {
      setCheckoutError("");
      const result = await createPaymentSession().unwrap();
      window.location.assign(result.data.url);
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate("/login");
        return;
      }
      setCheckoutError(
        requestError?.data?.message || "Could not start checkout.",
      );
    }
  };
  const [actionError, setActionError] = useState("");

  async function updateQuantity(cartItemId, quantity) {
    try {
      setActionError("");
      await updateCartProduct({ _id: cartItemId, quantity }).unwrap();
    } catch (requestError) {
      setActionError(
        requestError.data?.message || "Could not update quantity.",
      );
    }
  }

  async function removeItem(cartItemId) {
    try {
      setActionError("");
      await deleteCartProduct(cartItemId).unwrap();
    } catch (requestError) {
      setActionError(
        requestError.data?.message || "Could not remove this item.",
      );
    }
  }

  if (isLoading) {
    return <p className="px-6 py-16 text-center">Loading your cart...</p>;
  }

  if (isError) {
    return (
      <main className="px-6 py-16 text-center">
        <p>
          {error.status === 401
            ? "Log in to view your cart."
            : "Could not load your cart."}
        </p>
        {error.status === 401 ? (
          <Link to="/login" className="mt-4 inline-block underline">
            Log in
          </Link>
        ) : (
          <p className="mt-2 text-sm text-stone-500">
            {error.data?.message || error.error}
          </p>
        )}
      </main>
    );
  }

  const subtotal = items.reduce((total, item) => {
    const product = item.productId;
    const price = Number(product?.sellingPrice ?? product?.price ?? 0);
    return total + price * Number(item.quantity || 1);
  }, 0);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-xl bg-stone-900 px-5 py-3 text-white"
        >
          Browse the shop
        </Link>
      </main>
    );
  }

  const hasStockIssue=items.some((item)=>{
    const product=item.productId
    const stock=Number(product?.stock??0)
    const quantity=Number(item.quantity??1)
    return !product || stock<1 || quantity >stock
  })

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Your cart</h1>

      {actionError && (
        <p className="mt-4 text-sm text-red-700">{actionError}</p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <section className="divide-y divide-stone-200">
          {items.map((item) => {
            const product = item.productId;
            const price = Number(product?.sellingPrice ?? product?.price ?? 0);
            const quantity = Number(item.quantity || 1);
            const stock = Number(product?.stock??0)
            const quantityExceedsStock=quantity>stock

            return (
              <article key={item._id} className="flex gap-4 py-4 shadow-md  rounded-2xl ">
                <div className=" shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {product?.productImage?.[0] && (
                    <img
                    
                      src={product.productImage[0]}
                      alt={product.productName || "Cart product"}
                      className="h-24 w-24 object-contain  "
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-medium">
                    {product?.productName || "Product unavailable"}
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    {formatPrice.format(price)}
                  </p>
{!product || stock <1 ? (
  <p className="text-sm text-red-600">Out of stock</p>
):quantityExceedsStock?(
  <p className="text-sm text-red-600">Only {stock} left. Reduce quantity to continue.</p>
):stock<=5?(
    <p className="text-sm text-red-600">Only {stock} left in stock</p>
):null}
                  <div className=" inline-flex flex-wrap py-1 px-3 rounded-full border  border-gray-200 shadow-md items-center gap-2">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => updateQuantity(item._id, quantity - 1)}
                      className="h-6 w-6 inline-flex text-center items-center justify-center rounded-full border disabled:opacity-40"
                    >
                      <Minus size={16}/>
                    </button>

                    <span>{quantity}</span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, quantity + 1)}
                      disabled={!product || quantity>=stock}
                      className="h-6 w-6 flex items-center justify-center  rounded-full border"
                    >
              <Plus size={16}/>
                    </button>

                  </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      className="ml-2 text-sm text-red-700 underline"
                    >
                      Remove
                    </button>
                </div>

                <p className="shrink-0 font-medium">
                  {formatPrice.format(price * quantity)}
                </p>
              </article>
            );
          })}
        </section>

        <aside className="h-fit rounded-xl bg-stone-100 p-5">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-5 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice.format(subtotal)}</span>
          </div>
          <p className="mt-3 text-xs text-stone-500">
            Shipping and payment are handled at checkout.
          </p>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={IsCheckingOut || hasStockIssue}
            className="px-4 py-2 bg-stone-900 rounded-xl text-white w-full"
          >
            {IsCheckingOut ? "Opening checkout..." : "Proceed to checkout"}
          </button>
          {checkoutError && (
            <p className="pt-2 text-sm text-red-500">{checkoutError}</p>
          )}
          {hasStockIssue && (
            <p>Reduce the quantity or remove unavailable items before checkout.</p>
          )}
        </aside>
      </div>
    </main>
  );
};

export default Cart;

