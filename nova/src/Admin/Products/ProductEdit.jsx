import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import CloudinaryImageUpload from "../../Components/Upload/CloudinaryImageUpload"
import { UseGlob } from "../../Context/GlobalContext"
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../services/productsApi"

const ProductEdit = () => {
  const { id } = useParams()
  const { navigate } = UseGlob()

  const {
    data: product,
    isLoading: productLoading,
    isError: productIsError,
    error: productError,
  } = useGetProductDetailsQuery(id)

  const [
    updateProduct,
    { isLoading: saving, error: saveError },
  ] = useUpdateProductMutation()

  const [form, setForm] = useState({
    productName: "",
    brandName: "",
    category: "",
    price: "",
    sellingPrice: "",
    description: "",
    productImage: "",
    stock:""
  })

  useEffect(() => {
    if (!product) return

    setForm({
      productName: product.productName || "",
      brandName: product.brandName || "",
      category: product.category || "",
      price: String(product.price ?? ""),
      sellingPrice: String(product.sellingPrice ?? ""),
      stock:Number(product.stock??0),
      description: product.description || "",
      
      productImage: product.productImage?.[0] || "",
    })
  }, [product])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.productImage) return
    const productData = {
      ...form,
      price: Number(form.price),
      sellingPrice: Number(form.sellingPrice),
      stock:Number(form.stock),
      productImage: form.productImage.trim()
        ? [form.productImage.trim()]
        : [],
    }

    try {
      await updateProduct({
        _id: id,
        ...productData,
      }).unwrap()

      navigate("/dashboard/products")
    } catch (error) {
      console.error("Product update failed:", error)
    }
  }

  if (productLoading) {
    return <p className="px-6 py-12">Loading product...</p>
  }

  if (productIsError) {
    return (
      <p className="px-6 py-12 text-red-600">
        {productError?.data?.message || "Could not load product."}
      </p>
    )
  }

  if (!product) {
    return <p className="px-6 py-12">Product not found.</p>
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold">Edit product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span>Product name</span>
          <input
            className="mt-1 w-full rounded border p-3"
            name="productName"
            value={form.productName}
            onChange={handleChange}
            required
          />
        </label>

        <label className="block">
          <span>Brand name</span>
          <input
            className="mt-1 w-full rounded border p-3"
            name="brandName"
            value={form.brandName}
            onChange={handleChange}
            required
          />
        </label>

        <label className="block">
          <span>Category</span>
          <input
            className="mt-1 w-full rounded border p-3"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span>Price</span>
            <input
              className="mt-1 w-full rounded border p-3"
              type="number"
              min="0"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>



          <label className="block">
            <span>Selling price</span>
            <input
              className="mt-1 w-full rounded border p-3"
              type="number"
              min="0"
              name="sellingPrice"
              value={form.sellingPrice}
              onChange={handleChange}
              required
            />
          </label>


          <label className="block">
            <span>Available stock</span>
            <input
              className="mt-1 w-full rounded border p-3"
              type="number"
              min="0"
              step="1"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </label>


        </div>

        <CloudinaryImageUpload
          value={form.productImage}
          onChange={(productImage) =>
            setForm((previousForm) => ({ ...previousForm, productImage }))
          }
        />

        <label className="block">
          <span>Description</span>
          <textarea
            className="mt-1 w-full rounded border p-3"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        {saveError && (
          <p className="text-red-600">
            {saveError.data?.message || "Could not update product."}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-stone-900 px-5 py-3 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

          <Link
            to="/dashboard/products"
            className="rounded-xl border px-5 py-3"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}

export default ProductEdit

