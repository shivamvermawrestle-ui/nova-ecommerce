import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { UseGlob } from "../../Context/GlobalContext"
import { productsApi, useGetCartCountQuery, useGetCurrentUserQuery, useGetWishlistQuery, useLogoutMutation } from "../../services/productsApi"
import { useState } from "react"
import { Menu, X } from 'lucide-react';


const Navbar = () => {
  const dispatch=useDispatch()
  const {navigate}=UseGlob()
  const [menuOpen, setMenuOpen] = useState(false)
  const {data:user,isLoading:checkingUser}=useGetCurrentUserQuery()
  const [logout,{isLoading:isLogginOut,error:logoutError}]=useLogoutMutation()
  const handleLogout=async()=>{
    try{
      await logout().unwrap()
      dispatch(productsApi.util.resetApiState())
      navigate('/')
    }catch{
      //
    }
  }
const {data:cartCount=0}=useGetCartCountQuery(undefined,{skip:!user})
const {data:wishlist=[]}=useGetWishlistQuery(undefined,{
  skip:!user,
})
const wishlistCount=wishlist.filter((item)=>item.productId).length
const closeMenu=()=>setMenuOpen(false)
const navLinks=(
  <>
  <Link to={"/"}   onClick={closeMenu} className=' hover:text-orange-600'>Home</Link>
<Link to={"/shop"}  onClick={closeMenu} className=' hover:text-orange-600'>Shop</Link>
<Link to={"/ourstory"} onClick={closeMenu}  className='hover:text-orange-600'>Our Story</Link>
  </>
)

const userActions=(
  <>
  {checkingUser?(
    <span>Checking...</span>
       ):user ?(
        <>
        {user.role === "ADMIN" && (
      <Link to='/dashboard' className="bg-black  text-white font-semibold px-4 py-2  rounded-xl " onClick={closeMenu}>Dashboard</Link>
        )}
            <span className="text-sm">{user.name}</span>


    <Link to='/orders' onClick={closeMenu} className="border px-4 py-2 rounded-xl">My orders</Link>
<Link
  to="/wishlist"
  onClick={closeMenu}
  className="border px-4 py-2 rounded-xl text-center"
>
  Wishlist ({wishlistCount})
</Link>
<Link to={'/cart'}  className="border px-4 py-2 rounded-xl text-center">
  Cart({cartCount})
</Link>

    <button onClick={handleLogout} disabled={isLogginOut} className="rounded-xl bg-red-100 border border-red-500 px-4 py-2 text-red-500">{isLogginOut?'Logging out..':'Logout'}</button>
        </>
       ):(
    <Link to='/login'  onClick={closeMenu} className="border px-4 py-2 rounded-xl">Login</Link>
       )
      }
  </>
)
  return (
    <>
            <header className='mx-auto  flex max-w-7xl  bg-linear-to-br from-blue-700 to-indigo-700 text-white shadow-md items-center justify-between px-6 py-4  gap-2 sticky top-0 z-100'>
        <Link to="/" className='text-2xl font-bold tracking-tight flex '>Hook <span className='text-orange-600'>.</span></Link>

        <nav className=' hidden items-center gap-8 text-sm font-medium lg:flex '>
          {navLinks}
          {userActions}
        </nav>

     
        {/* Mobile Actions  */}
        <div className=" relative flex items-center gap-2 lg:hidden">
     
 <button
 onClick={()=>setMenuOpen(!menuOpen)}
 aria-label={menuOpen ? "Close menu":"Open menu"}
 aria-expanded={menuOpen}
  className="rounded-lg p-2 text-xl hover:bg-amber-300 ">{menuOpen? <X /> :    <Menu />}</button>

{menuOpen && (
  <div className=" absolute top-10 -right-4  rounded-xl  bg-linear-to-br from-blue-700 to-indigo-700 text-white flex flex-col gap-2 bg-amber-100 px-4 py-5 lg:hidden">
    <nav className="flex flex-col gap-5 text-sm font-medium">{navLinks}</nav>
    <div className="flex flex-col items-stretch text-nowrap gap-2 ">
      {userActions}
    </div>
  </div>
)}
        </div>



{!menuOpen &&  logoutError && (
  <p>Logout  failed.Please try again.</p>
)}
      </header>
    </>
  )
}

export default Navbar

