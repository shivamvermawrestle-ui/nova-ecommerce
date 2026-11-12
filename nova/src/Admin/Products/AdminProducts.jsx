import { Link } from "react-router-dom"
import { useDeleteProductMutation, useGetProductsQuery } from "../../services/productsApi"
import { UseGlob } from "../../Context/GlobalContext"
import { useState } from "react"

const AdminProducts = () => {
  const {formatPrice}=UseGlob()
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useGetProductsQuery()
const [deleteProduct,{isLoading:isDeleting,error:deleteError}]=useDeleteProductMutation()
const handleDelete=async(product)=>{
  const confirmed = window.confirm(`Delete "${product.productName}"?`)
    if(!confirmed) 
      return
    try{
      await deleteProduct(product._id).unwrap()
    }catch(error){
      console.error("Product delete failed:",error)
    }
}

const [search,setSearch]=useState("")
const normalizedSearch=search.trim().toLowerCase()
const filteredProducts=products.filter((product)=>{
  const matchesSearch=product._id.toLowerCase().includes(normalizedSearch) || (product.productName || product.category).toLowerCase().includes(normalizedSearch)
  return matchesSearch
})
  return (
    <main className="mx-auto max-w-7xl flex flex-col gap-4 px-6 py-12">

      <div className="flex justify-between items-center">
      <h1 className=" text-xl  lg:text-2xl font-semibold text-nowrap">Manage products</h1>
<Link to="/dashboard/add-product" className="bg-linear-to-r from-blue-500 to-indigo-500 text-nowrap  px-4 py-2 text-white rounded-xl  shadow-sm ">Add product</Link>
      </div>
 <input 
 value={search}
 onChange={(e)=>setSearch(e.target.value)}
 className="border p-2 rounded-xl"
 placeholder="search..."

 
 />
{deleteError && (
  <p>{deleteError.data?.message || "Could  not delete product."}</p>
)}
      {isLoading && <p>Loading products...</p>}

      {isError && (
        <p className="text-red-600">
          {error?.data?.message || "Could not load products."}
        </p>
      )}

      {!isLoading && !isError && filteredProducts.length === 0 && (
        <p>No products found.</p>
      )}
<div className="overflow-auto p-4 shadow-lg lg:h-[350px]  rounded-2xl">
  <table  className="w-full min-w-[700px]  table-fixed border-collapse">

    <thead>
      <tr className="border-b text-sm text-stone-500">
<th>Product</th>
<th>Category</th>
<th>Price</th>
<th>Selling Price</th>
<th>Stock</th>
<th>Actions</th>
      </tr>
    </thead>
    <tbody>
   {filteredProducts.map((product)=>(
    <tr key={product._id} className="border-b   ">
      <td className="p-2 ">
        <div className="flex items-center  justify-center gap-1">
          {product.productImage?.[0] && (
            <img src={product.productImage[0]} alt={product.productName} className="h-8 w-8 rounded-full object-contain shrink-0" />
          )}
<div className="flex flex-col  gap-1">
  <p className="font-medium break-words  ">{product.productName}</p>
  <p className="">{product.brandName}</p>

</div>
        </div>
      </td>
      <td className="p-2 text-center  ">{product.category}</td>
      <td className="p-2 text-center ">{formatPrice.format(Number(product.price || 0))}</td>
      <td className="p-2 text-center  ">{formatPrice.format(Number(product.sellingPrice || 0))}</td>
      <td className="p-2 text-center">{Number(product.stock ?? 0)}</td>
      <td className="p-2 text-center">{Number(product.stock??0)===0?(
        <span className=" text-nowrap rounded-full bg-red-100 px-3 py-1  text-xs text-red-700">Out of stock</span>
      ):Number(product.stock??0)<=5?(
           <span className=" text-nowrap rounded-full bg-amber-100 px-3 py-1  text-xs text-amber-700">Low stock</span>
      ):(
                   <span className=" text-nowrap rounded-full bg-green-100 px-3 py-1  text-xs text-green-700">In stock</span>
      )}</td>
      <td className="p-2 ">
<div className="flex items-center  justify-center gap-2">

  <Link to={`/dashboard/products/${product._id}/edit`} className="py-2 px-3 text-sm flex justify-center  bg-stone-900 text-white rounded-xl">Edit</Link>
            <button 
            type="button"
            onClick={()=>handleDelete(product)}
            disabled={isDeleting}
            className="  px-3 py-2 border text-sm border-red-500 text-red-500 bg-red-50 rounded-xl"> Delete</button>
</div>

      </td>
    </tr>
   ))}
    </tbody>

  </table>

</div>

    </main>
  )
}

export default AdminProducts

