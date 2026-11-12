import { Link, useParams } from "react-router-dom"
import { useAddToCartMutation, useAddWishlistProductMutation, useGetCurrentUserQuery, useGetProductDetailsQuery, useGetProductReviewsQuery, useGetWishlistQuery, useRemoveWishlistProductMutation,useSubmitProductReviewMutation } from "../../services/productsApi"
import { UseGlob } from "../../Context/GlobalContext"
import { useState } from "react"
import { Heart } from "lucide-react"

const formatPrice = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const ProductDetails = () => {
  const {navigate}=UseGlob()
  const params= useParams()
const id = params.id
  const {data:product,isLoading , isError,error}= useGetProductDetailsQuery(id)
const [
  addToCart,
  { isLoading: isAdding, isSuccess: added, error: addError },
] = useAddToCartMutation()
const {data:user,isLoading:isCheckingUser}=useGetCurrentUserQuery()
const  {data:wishlist=[]}=useGetWishlistQuery(undefined,{
  skip:!user
})
const [addWishlistProduct,{isLoading:isAddingWishlist}]=useAddWishlistProductMutation()
const [removeWishlistProduct,{isLoading:isRemovingWishlist}]=useRemoveWishlistProductMutation()
const [wishlistError, setWishlistError] = useState("")

const{
  data:reviewSummary,
  isLoading:isLoadingReviews,
  isError:isReviewsError,
  error:reviewsError,
}=useGetProductReviewsQuery(id)

const [submitProductReview, { isLoading: isSubmittingReview }] =
  useSubmitProductReviewMutation();
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [reviewMessage, setReviewMessage] = useState("")
  if(isLoading){
    return <p className="px-6 py-16 text-center ">Loading Product Detail...</p>
  }
  if(isError || !product){
  return (  <main className="p-20  flex items-center justify-center gap-2 text-center">
<p>{error?.data?.message || 'Unable  to load product.'}</p>
<Link to={'/shop'} className="border px-4 py-2 border rounded-xl ">Back  to Shop</Link>
    </main>
  )
  }
const handleReviewSubmit=async (e)=>{
  e.preventDefault()
  setReviewMessage("")
  if(!user){
    navigate("/login")
    return
  }
  try{
    await submitProductReview({productId:product._id,
      rating,
      comment,
    }).unwrap()
    setRating(5)
    setComment("")
    setReviewMessage("Thanks! Your review was saved.")
  }catch(requestError){
    if(requestError.status===401){
      navigate("/login")
      return
    }
    setReviewMessage(requestError.data?.message || "Could not submit your review.")
  }

}
  const isWishlisted=Boolean(product?._id) &&wishlist.some((item)=>item.productId?._id=== product._id)
  const handleWishlistClick =async ()=>{
    setWishlistError("")
    if(!user){
      navigate("/login")
      return
    }
    try{
      if(isWishlisted){
        await removeWishlistProduct(product._id).unwrap()
      }else{
                await addWishlistProduct(product._id).unwrap()
      }
    }catch(requestError){

      if(requestError.status===401){
        navigate("/login")
        return
      }
      setWishlistError(requestError.data?.message || "Could not update wishlist.")
    }
  }
  const image = product.productImage?.[0]
  const price= product.sellingPrice ?? product.price??0
const stock=Number(product.stock ?? 0)
const isOutOfStock=stock  <1


  const handleAddToCart=async()=>{

    try{
      await addToCart(product._id).unwrap()
    }catch(requestError){
      if(requestError.status === 401){
        navigate('/login')
      }
  }}
  return (
<main className="mx-auto flex flex-col gap-4  max-w-6xl px-6 py-12 ">
  <Link to={'/shop'}>Back to Shop</Link>
    <section className="grid gap-10 md:grid-cols-2 ">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-stone-100">
{
  image? (
    <img src={image} alt={product.productName}
    className="h-full w-full object-contain"
    />
  ):(
    <p>No image available</p>
  )
}
      </div>
            <div className="">
          <p className="text-sm text-orange-700">{product.category}</p>
          <h1 className="mt-3 text-3xl font-semibold">{product.productName}</h1>
          <p className="mt-2 text-stone-500">{product.brandName}</p>
          <p className="mt-6 text-xl font-medium">{formatPrice.format(price)}</p>
          {isOutOfStock ? (
            <p className="text-sm font-medium text-red-700">Out of stock</p>
          ):stock<=5?(
           <p className="text-sm font-medium text-red-700">Only {stock} left in stock</p>
          ):(
               <p className="text-sm font-medium text-green-700">In stock</p>
          )}
          <p className="mt-6 leading-7 text-stone-600">{product.description}</p>

        </div>
   {added && (
            <p>Added to cart</p>
          )}
   {addError && (
            <p>{addError.data?.message || 'Could not add this product.'}</p>
          )}
    </section>

<section className="mt-12 border-t border-stone-200 pt-8">
  <h2 className="text-2xl font-semibold">Customer reviews</h2>

  <p className="mt-2 text-stone-600">
    {reviewSummary?.averageRating?.toFixed(1) || "0.0"} / 5 ·{" "}
    {reviewSummary?.totalReviews || 0} reviews
  </p>

  {isLoadingReviews ? (
    <p className="mt-6">Loading reviews...</p>
  ) : isReviewsError ? (
    <p className="mt-6 text-red-600">
      {reviewsError?.data?.message || "Could not load reviews."}
    </p>
  ) : reviewSummary?.reviews?.length ? (
    <div className="mt-6 space-y-4">
      {reviewSummary.reviews.map((review) => (
        <article key={review._id} className="rounded-xl border p-4">
          <div className="flex justify-between gap-3">
            <p className="font-medium">
              {review.userId?.name || "Customer"}
            </p>
            <p className="text-sm text-stone-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>

          <p className="mt-2 text-amber-600" aria-label={`${review.rating} out of 5 stars`}>
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </p>
          <p className="mt-2 whitespace-pre-wrap">{review.comment}</p>
        </article>
      ))}
    </div>
  ) : (
    <p className="mt-6 text-stone-600">No reviews yet.</p>
  )}

  {isCheckingUser ? (
    <p className="mt-8">Checking your account...</p>
  ) : user ? (
    <form onSubmit={handleReviewSubmit} className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold">Write a review</h3>

      <label className="flex flex-col gap-2">
        Rating
        <select
          value={rating}
          onChange={(event) => setRating(Number(event.target.value))}
          className="rounded-lg border border-stone-300 p-2"
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} star{value > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        Comment
        <textarea
          required
          maxLength={1000}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="min-h-28 rounded-lg border border-stone-300 p-3"
          placeholder="Share your experience with this product"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmittingReview}
        className="rounded-xl bg-stone-900 px-5 py-3 text-white disabled:opacity-50"
      >
        {isSubmittingReview ? "Saving review..." : "Submit review"}
      </button>

      {reviewMessage && <p>{reviewMessage}</p>}
    </form>
  ) : (
    <p className="mt-8">
      <Link to="/login" className="underline">
        Log in
      </Link>{" "}
      to write a review after purchasing this product.
    </p>
  )}
</section>
          <div className="flex flex-col gap-2   sticky
           bottom-0 lg:static bg-white pt-4 w-full z-50">

<div className="flex gap-2">
    <button onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
          className="rounded-xl w-full py-2 px-4 bg-stone-900 text-white disabled:opacity-60 "
          >{isOutOfStock ?"Out of stock":isAdding? 'Adding...' :'Add to cart'}
          </button>
           <button 
     type="button"
          className="rounded-xl  w-full py-2 px-4 bg-stone-900 text-white disabled:opacity-60 "
          >Buy now
          </button>
</div>
    <button onClick={handleWishlistClick}
          disabled={isCheckingUser || isAddingWishlist}
          aria-pressed={isWishlisted}
          className="rounded-xl w-full flex items-center justify-center  gap-2  py-2 px-4 bg-stone-900 text-white disabled:opacity-60 "
          ><Heart  size={18} fill={isWishlisted?"currentColor" :"none"}/>{isAddingWishlist?"Saving..." : isRemovingWishlist?"Removing...":isWishlisted?"Saved to wishlist":"Save to wishlist"}</button>
          {wishlistError && (
            <p>{wishlistError}</p>
          )}
          </div>

</main>
  )
}

export default ProductDetails

