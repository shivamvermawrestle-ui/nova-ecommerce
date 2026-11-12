import { NavLink, Outlet } from "react-router-dom"

const navClass = ({ isActive }) =>
  `block rounded-lg px-4 py-3 ${
    isActive
      ? "bg-stone-900 text-white"
      : "text-stone-700 hover:bg-stone-100"
  }`

const AdminLayout = () => {
  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row gap-6 px-4 py-6">
        <aside className="w-full shrink-0 rounded-xl border border-stone-200 p-4 flex flex-col gap-4 md:w-60">
          <h2>Nook Admin</h2>

          <nav>
            <NavLink to={"/dashboard"} end className={navClass}>Overview</NavLink>
            <NavLink to={"/dashboard/products"} end className={navClass}>Manage Products</NavLink>
            <NavLink to={"/dashboard/users"} end className={navClass}>Manage User</NavLink>
            <NavLink to={"/dashboard/orders"} end className={navClass}> Orders</NavLink>
          </nav>
        </aside>

        <section className="min-w-0 flex-1 rounded-xl border border-stone-200"> 
          <Outlet/>
        </section>
      </div>
    </>
  )
}

export default AdminLayout

