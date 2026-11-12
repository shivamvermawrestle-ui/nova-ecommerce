import { useState } from "react"
import { UseGlob } from "../../Context/GlobalContext"
import { useUploadProductMutation } from "../../services/productsApi"
import { Link } from "react-router-dom"
import CloudinaryImageUpload from "../../Components/Upload/CloudinaryImageUpload"


const AddProduct = () => {
    const {navigate}=UseGlob()
    const [uploadProduct,{isLoading,error}]=useUploadProductMutation()

    const [form,setForm]=useState({
        productName: "",
    brandName: "",
    category: "",
    price: "",
    sellingPrice: "",
    description: "",
    productImage: "",
    stock:""
    })
const handleChange =(e)=>{
    const {name,value}=e.target
    setForm((prev)=>({
        ...prev,
        [name]:value
    }))
}
    const handleSubmit = async(e)=>{
        e.preventDefault()
    if (!form.productImage) return
    const productData={
        ...form,
         price: Number(form.price),
         stock:Number(form.stock),
      sellingPrice: Number(form.sellingPrice),
      productImage: form.productImage.trim()
        ? [form.productImage.trim()]
        : [],
    }
    try{
        await uploadProduct(productData).unwrap()
        navigate("/dashboard/products")
    }catch(error){
        console.error("Product upload failed:",error)
    }
    }
  return (
<>
<main className="mx-auto  flex flex-col gap-4 justify-center max-w-3xl px-6 py-12">
   <h1>Add Product</h1>

   <form onSubmit={handleSubmit} className="flex flex-col  gap-2">
    <div className="flex flex-col gap-1">
        <label >Product Name</label>
        <input 
        className="p-2 rounded-xl border  border-gray-400"
        name="productName"
        value={form.productName}
        onChange={handleChange}
        required
        />
    </div>
    <div className="flex flex-col gap-1">
        <label >Brand Name</label>
        <input 
        className="p-2 rounded-xl border  border-gray-400"
        name="brandName"
        value={form.brandName}
        onChange={handleChange}
        required
        />
    </div>
    <div className="flex flex-col gap-1">
        <label >Category</label>
        <input 
        className="p-2 rounded-xl border  border-gray-400"
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        />
    </div>
    <div className="flex flex-col gap-1">
        <label >Price</label>
        <input 
        className="p-2 rounded-xl border  border-gray-400"
      min='0'
        name="price"
        value={form.price}
        onChange={handleChange}
        required
        />
    </div>
    <div className="flex flex-col gap-1">
        <label >Selling price</label>
        <input 
        type="number"
    min='0'
        className="p-2 rounded-xl border  border-gray-400"
        name="sellingPrice"
        value={form.sellingPrice}
        onChange={handleChange}
        required
        />
    </div>

    <div className="flex flex-col gap-1">
        <label >Available stock</label>
        <input type="number" 
        min="0"
        step="1"
        name="stock"
        value={form.stock}
        onChange={handleChange}
        required
        className="p-2 rounded-xl   border border-gray-400"

        />

    </div>
    <CloudinaryImageUpload
      value={form.productImage}
      onChange={(productImage) =>
        setForm((previous) => ({ ...previous, productImage }))
      }
    />
    <div className="flex flex-col gap-1">
        <label >Description</label>
        <textarea 
        className="p-2 rounded-xl border  border-gray-400"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
        />
    </div>


    {error && (
        <p>{error.data?.message || "Could not add product"}</p>
    )}
    <div className="flex gap-2">
        <button type="submit" disabled={isLoading}
        className="px-4 py-2 rounded-xl text-white bg-stone-900 text-center">{isLoading?"Adding..." :"Add product"}</button>
        <Link to="/dashboard/products"
        className="px-4 py-2 rounded-xl text-stone-900  bg-gray-100 text-center">Cancel</Link>

    </div>
   </form>

   
    </main> 

</>
  )
}

export default AddProduct

