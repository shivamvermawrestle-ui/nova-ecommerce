import { useState } from 'react'
import ProductCard from '../../Components/Product/ProductCard'
import { useGetProductsQuery,useGetCategoriesQuery,useGetProductsByCategoryQuery,
  useSearchProductsQuery,
 } from '../../services/productsApi'

const Shop=()=> {

  const [activeCategory, setActiveCategory] = useState('')
  const {data:categoryItems=[]}=useGetCategoriesQuery()
const [searchDraft, setSearchDraft] = useState('')
const [searchTerm, setSearchTerm] = useState('')
const [sortBy, setsortBy] = useState("newest")
  const categories=[
    ...new Set(categoryItems.map((item)=>item.category).filter(Boolean)),
  ]
  const { data: allProducts = [],
     isLoading:allLoading, 
     isError:allFailed,
      error:allError, 
      refetch:refetchAll } =
    useGetProductsQuery(undefined,{
      skip:Boolean(activeCategory) ||Boolean(searchTerm)
    })
const {data:filteredProducts=[],
 isLoading:filterLoading,
 isError:filterFailed,
 error:filterError,
 refetch:refetchFiltered,
}=useGetProductsByCategoryQuery(activeCategory,{
  skip:!activeCategory || Boolean(searchTerm)
})

const {data:searchResults=[],
 isLoading:searchLoading,
 isError:searchFailed,
 error:searchError,
 refetch:refetchSearch,
}=useSearchProductsQuery(searchTerm,{
  skip:!searchTerm,
})
const products=searchTerm?searchResults:activeCategory?filteredProducts:allProducts
const isLoading=searchTerm?searchLoading:activeCategory?filterLoading:allLoading
const isError=searchTerm?searchFailed:activeCategory?filterFailed:allFailed
const error=searchTerm?searchError:activeCategory?filterError:allError
const refetch=searchTerm?refetchSearch:activeCategory?refetchFiltered:refetchAll
const sortedProducts=[...products].sort((a,b)=>{
  const priceA=Number(a.sellingPrice?? a.price ?? 0)
  const priceB=Number(b.sellingPrice?? b.price ?? 0)
  switch(sortBy){
    case "price-low":return priceA-priceB;
    case "price-high":return priceB-priceA;
    case "name-asc":
      return (a.productName || "" ).localeCompare(b.productName || "");
      default: 
      return new Date(b.createdAt || 0)-new Date(a.createdAt || 0)

  }
})

  if (isLoading) {
    return <p className="px-6 py-16 text-center">Loading products...</p>
  }

  if (isError) {
    return (
      <section className="px-6 py-16 text-center">
        <p>Unable to  load products.</p>
        <p className="mt-2 text-sm text-stone-500">
          {error?.data?.message || error?.error ||'There maybe some network issues.'}
        </p>
        <button
          onClick={refetch}
          className="mt-5 rounded-full bg-stone-900 px-5 py-2 text-sm text-white"
        >
          Try again
        </button>
      </section>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">


      <div className="mt-2 flex items-center gap-4 ">
        <div className='flex flex-col gap-2 '>
              <p className="text-[10px] lg:text-sm text-orange-700 text-nowrap ">Made for everyday</p>
        <h1 className=" text-xl lg:text-2xl  font-semibold text-nowrap">Shop all</h1>
        <p className="text-sm text-stone-500">{products.length} products</p>
        </div>

   <div>
          <form onSubmit={(e)=>{
            e.preventDefault()
            setSearchTerm(searchDraft.trim())
setActiveCategory("")  

          }} className='flex max-w-md border-stone-300 border-b'>
            <input  
            value={searchDraft}
            onChange={(e)=>setSearchDraft(e.target.value)}
            placeholder='search...'
            className=' min-w-0 flex-1 bg-transparent py-2 text-sm outline-none  '
            /> 
            <button type='submit' className='px-3 text-sm font-medium'>Search</button>
          </form>
   </div>
     
      </div>

<div className='flex justify-end'>
  <label className='flex items-center gap-2  text-sm' >
    Sort by
    <select value={sortBy} onChange={(e)=>setsortBy(e.target.value)} 
    className='rounded-full border border-stone-300 bg-white px-3 py-1'
     >
      <option value="newest">Newest</option>
      <option value="price-low">Price:low to high</option>
      <option value="price-high">Price:high to low</option>
      <option value="name-asc">Nam: A to Z</option>
     </select>


  </label>
</div>

      <div className='flex flex-wrap gap-2 pt-4 '>
        <button
  onClick={() => {
    setActiveCategory("");
    setSearchDraft("");
    setSearchTerm("");
  }}
  className={`rounded-full px-4 py-2 text-sm ${!activeCategory ? 'bg-stone-900 text-white' : 'bg-stone-100'}`}
>
  All
</button>
        { categories.map((category)=>(
          <button key={category} onClick={() => {
   setActiveCategory(category);
   setSearchDraft("");
   setSearchTerm("");
 }} className={`rounded-full px-4 py-2  text-sm ${activeCategory === category?'bg-stone-900 text-white':'bg-stone-100'}`}>{category}</button>
        ))}
      </div>

      {sortedProducts.length === 0 ? (
        <p className="py-16 text-center text-stone-500">
Currently no products available
        </p>
      ) : (
        <section className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      )}
    </main>
  )
}

export default Shop

