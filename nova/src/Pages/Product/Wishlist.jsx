import {Link} from "react-router-dom"
import {useGetWishlistQuery} from "../../services/productsApi"
import ProductCard from "../../Components/Product/ProductCard"

const Wishlist = () => {
    const {
        data:wishlist=[],
        isLoading,
        isError,
        error,
    }=useGetWishlistQuery()

    if(isLoading){
        return <p>Loading wishlist...</p>
    }
    if(isError){
        return (
                  <main className="px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Could not load wishlist</h1>
        <p className="mt-3 text-stone-600">
          {error?.data?.message || "Please try again."}
        </p>
        {error?.status === 401 && (
          <Link to="/login" className="mt-4 inline-block underline">
            Log in
          </Link>
        )}
      </main>
        )
    }
    
    const products =wishlist.map((item)=>item.productId).filter(Boolean)
  return (
<>
<main className="mx-auto px-6 py-12 flex flex-col gap-4  max-w-6xl">
    <h1 className="text-2xl font-bold">Your wishlist</h1>
    {products.length===0?(
        <section className="py-16 text-center">
            <p>You have no saved products yet.</p>
            <Link to="/shop" className="px-4 py-2 bg-black text-white text-center rounded-xl">Browse the shop</Link>

        </section>
    ):(
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product)=>(
                <ProductCard key={product._id} product={product}/>
            ))}
        </section>
    )}

</main>
</>
  )
}

export default Wishlist

