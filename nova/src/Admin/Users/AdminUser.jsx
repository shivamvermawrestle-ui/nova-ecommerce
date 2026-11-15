import { useState } from "react";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../services/productsApi";
import { UseGlob } from "../../Context/GlobalContext";

const AdminUser = () => {
  const { dark } = UseGlob();

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useGetUsersQuery();

  const [updateUser, { isLoading: isUpdating, error: updateError }] =
    useUpdateUserMutation();

  const [roleDrafts, setRoleDrafts] = useState({});

  const handleRoleChange = (userId, role) => {
    setRoleDrafts((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const handleSaveRole = async (user) => {
    const role = roleDrafts[user._id] ?? user.role;

    if (role === user.role) return;

    try {
      await updateUser({ userId: user._id, role }).unwrap();

      setRoleDrafts((prev) => {
        const updated = { ...prev };
        delete updated[user._id];
        return updated;
      });
    } catch (error) {
      console.error("User role update failed:", error);
    }
  };

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1
          className={`text-xl lg:text-2xl font-bold tracking-tight ${
            dark ? "text-[#EAF0FA]" : "text-[#202C50]"
          }`}
        >
          User Management
        </h1>

        <p
          className={`text-xs sm:text-sm mt-0.5 ${
            dark ? "text-[#8190AA]" : "text-[#64718A]"
          }`}
        >
          View registered accounts and assign user access roles (
          {users.length} {users.length === 1 ? "user" : "users"})
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <p
          className={`text-sm ${
            dark ? "text-[#8190AA]" : "text-[#64718A]"
          }`}
        >
          Loading users...
        </p>
      )}

      {/* Fetch Error */}
      {isError && (
        <p
          className={`rounded-xl border p-3 text-sm ${
            dark
              ? "border-[#70414C] bg-[#3B2934] text-[#F08089]"
              : "border-[#F1C9CC] bg-[#FFF1F1] text-[#B74747]"
          }`}
        >
          {error?.data?.message || "Could not load users"}
        </p>
      )}

      {/* Update Error */}
      {updateError && (
        <p
          className={`rounded-xl border p-3 text-sm ${
            dark
              ? "border-[#70414C] bg-[#3B2934] text-[#F08089]"
              : "border-[#F1C9CC] bg-[#FFF1F1] text-[#B74747]"
          }`}
        >
          {updateError?.data?.message || "Could not update user"}
        </p>
      )}

      {/* Empty State */}
      {!isLoading && !isError && users.length === 0 && (
        <div
          className={`rounded-2xl border p-12 text-center text-sm ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#8190AA]"
              : "border-[#D8E1EF] bg-white text-[#64718A]"
          }`}
        >
          No users found.
        </div>
      )}

      {/* Users Table */}
      {!isLoading && !isError && users.length > 0 && (
        <div
          className={`overflow-x-auto rounded-2xl border shadow-sm ${
            dark
              ? "bg-[#202A40] border-[#35435C]"
              : "bg-white border-[#D8E1EF]"
          }`}
        >
          <table className="w-full min-w-[700px] text-center border-collapse">
            <thead>
              <tr
                className={`border-b text-xs font-semibold uppercase tracking-wider ${
                  dark
                    ? "border-[#35435C] text-[#AAB8D0] bg-[#26334D]"
                    : "border-[#D8E1EF] text-[#64718A] bg-[#F7F9FC]"
                }`}
              >
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody
              className={`divide-y text-sm ${
                dark
                  ? "divide-[#35435C] text-[#EAF0FA]"
                  : "divide-[#D8E1EF] text-[#202C50]"
              }`}
            >
              {users.map((user) => {
                const selectedRole = roleDrafts[user._id] ?? user.role;

                return (
                  <tr
                    key={user._id}
                    className={`transition-colors ${
                      dark
                        ? "hover:bg-[#26334D]"
                        : "hover:bg-[#F7F9FC]"
                    }`}
                  >
                    {/* Name */}
                    <td className="px-4 py-3 text-left font-medium">
                      {user.name || "unnamed"}
                    </td>

                    {/* Email */}
                    <td
                      className={`px-4 py-3 text-left text-xs ${
                        dark ? "text-[#8190AA]" : "text-[#64718A]"
                      }`}
                    >
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <select
                        value={selectedRole}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className={`rounded-lg border py-1 px-3 text-xs font-medium outline-none transition-colors shadow-2xs ${
                          dark
                            ? "bg-[#171E30] border-[#465570] text-[#EAF0FA] focus:border-[#9BB2D8] focus:ring-2 focus:ring-[#9BB2D8]/20"
                            : "bg-white border-[#D8E1EF] text-[#202C50] focus:border-[#7895C5] focus:ring-2 focus:ring-[#7895C5]/20"
                        }`}
                      >
                        <option value="FARMER">Farmer</option>
                        <option value="GENERAL">General</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>

                    {/* Joined Date */}
                    <td
                      className={`px-4 py-3 text-xs ${
                        dark ? "text-[#8190AA]" : "text-[#64718A]"
                      }`}
                    >
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleSaveRole(user)}
                          disabled={
                            isUpdating || selectedRole === user.role
                          }
                          className={`py-1.5 px-4 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            dark
                              ? "bg-[#7895C5] hover:bg-[#9BB2D8] text-[#171E30]"
                              : "bg-[#202C50] hover:bg-[#344F82] text-white"
                          }`}
                        >
                          {isUpdating ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default AdminUser;