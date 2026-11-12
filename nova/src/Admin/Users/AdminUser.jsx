import { useState } from "react"
import { useGetUsersQuery, useUpdateUserMutation } from "../../services/productsApi"

const AdminUser = () => {
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useGetUsersQuery()
    const [updateUser,{isLoading:isUpdating,error:updateError}]=useUpdateUserMutation()
    const [roleDrafts, setRoleDrafts] = useState({})

    const handleRoleChange=(userId,role)=>{
        setRoleDrafts((prev)=>({
            ...prev,
            [userId]:role
        }))
    }

    const handleSaveRole=  async (user)=>{
        const role = roleDrafts[user._id]??user.role
        if(role === user.role) return
        try{
            await updateUser({userId:user._id,role}).unwrap()
            setRoleDrafts((prev)=>{
                const updated={...prev}
                delete updated[user._id]
                return updated
            })
        }catch(error){
            console.error("User role update failed:",error)
        }
    }
  return (
    <>
    <main className="p-4">
        <h1>User Management</h1>
        {isLoading && <p>Loading users...</p>}
        {isError && (
            <p>{error.data?.message || "Could not load users"}</p>
        )}
        {updateError && (
            <p>{updateError?.data?.message || "Could not update user"}</p>
        )}
{!isLoading && !isError && users.length===0&&(
    <p>No users found.</p>
)}

{!isLoading && !isError && users.length >0 && (
    <div className="overflow-auto p-4 rounded-2xl shadow-sm">
        <table className="w-full min-w-[700px]  text-center border-collapse">
            <thead>
            <tr className="border-b text-sm text-stone-500">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
                {users.map((user)=>{
                    const selectedRole=roleDrafts[user._id] ?? user.role
                    return(
                        <tr key={user._id} className="border-b">
                            <td className="p-2">{user.name || "unamed"}</td>
                            <td className="p-2">{user.email}</td>
                            <td>
                                <select value={selectedRole} onChange={(e)=>handleRoleChange(user._id,e.target.value)} className="rounded-full border py-1 px-2">
                                <option value="FARMER">Farmer</option>
                                <option value="GENERAL">General</option>
                                <option value="ADMIN">Admin</option>
                                </select>
                                </td>
                                <td className="p-2">{user.createdAt?new Date(user.createdAt).toLocaleDateString():"-"}</td>
                                <td className="p-2 flex justify-center">
<button
type="button"
onClick={()=>handleSaveRole(user)}
disabled={isUpdating || selectedRole === user.role}
className="py-2 px-3 text-sm flex justify-center  bg-stone-900 text-white rounded-xl"
>{isUpdating?"Saving..." : "Save"}</button>

                                </td>
                        </tr>
                    )
                })}
            </tbody>

        </table>

    </div>
)}
    </main>
    </>
  )
}

export default AdminUser

