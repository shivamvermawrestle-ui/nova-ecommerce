import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import {
  useAddWishlistProductMutation,
  useGetCurrentUserQuery,
  useGetWishlistQuery,
  useRemoveWishlistProductMutation,
} from "../../services/productsApi";
import { useState } from "react";
import { Heart } from "lucide-react";

function ProductCard({ product }) {
  const { formatPrice, navigate } = UseGlob();
  const { data: user, isLoading: isCheckingUser } = useGetCurrentUserQuery();
  const { data: wishlist = [] } = useGetWishlistQuery(undefined, {
    skip: !user,
  });
  const [addWishlistProduct, { isLoading: isAdding }] =
    useAddWishlistProductMutation();
  const [removeWishlistProduct, { isLoading: isRemoving }] =
    useRemoveWishlistProductMutation();

  const [wishlistError, setWishlistError] = useState("");
  const image = product.productImage?.[0];
  const price = product.sellingPrice ?? product.price ?? 0;
  const stock = Number(product.stock ?? 0);
  const isWishlisted = wishlist.some(
    (item) => item.productId?._id === product._id,
  );
  const handleWishlistClick = async () => {
    setWishlistError("");
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      if (isWishlisted) {
        await removeWishlistProduct(product._id).unwrap();
      } else {
        await addWishlistProduct(product._id).unwrap();
      }
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate("/login");
        return;
      }
      setWishlistError(
        requestError.data?.message || "Could not update wishlist.",
      );
    }
  };

  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
        <Link to={`/product/${product._id}`} className="block h-full">
          {image ? (
            <img
              src={image}
              alt={product.productName}
              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-400">
              No image
            </div>
          )}
        </Link>

        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs">
          {product.category}
        </span>

        {stock === 0 ? (
          <span className="absolute right-2 top-2 rounded-full text-sm bg-red-100 py-1 px-3 text-nowrap text-red-700 font-medium">
            Out of stock
          </span>
        ) : stock <= 5 ? (
          <span className="absolute right-2 top-2 rounded-full text-sm bg-amber-100  text-amber-700 py-1 px-3 text-nowrap font-medium">
            Only {stock} left
          </span>
        ) : null}

        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={isCheckingUser || isAdding || isRemoving}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className="absolute right-2 bottom-2 bg-white   p-2 rounded-full shadow transition hover:text-red-600 disabled:opacity-50"
        >
          <Heart size={19} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <Link to={`/product/${product._id}`}>
            <h2 className="font-medium">{product.productName}</h2>
          </Link>

          <p className="mt-1 text-sm text-stone-500">{product.brandName}</p>
        </div>

        <p className="shrink-0 text-sm font-semibold">
          {formatPrice.format(price)}
        </p>
      </div>
      {wishlistError && <p>{wishlistError}</p>}
    </article>
  );
}

export default ProductCard;

