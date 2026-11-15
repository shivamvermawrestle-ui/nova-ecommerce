import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../services/productsApi";
import { UseGlob } from "../../Context/GlobalContext";

const AdminRoute = () => {
  const { dark } = UseGlob();

  const { data: user, isLoading, isError } = useGetCurrentUserQuery();

  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("nova_user") || "null")
      : null;

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          dark ? "bg-[#171E30] text-[#EAF0FA]" : "bg-[#F7F9FC] text-[#202C50]"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className={`h-8 w-8 animate-spin rounded-full border-4 ${
              dark
                ? "border-[#35435C] border-t-[#7895C5]"
                : "border-[#D8E1EF] border-t-[#202C50]"
            }`}
          />

          <p
            className={`text-sm font-medium ${
              dark ? "text-[#AAB8D0]" : "text-[#64718A]"
            }`}
          >
            Verifying Admin Access...
          </p>
        </div>
      </div>
    );
  }

  const effectiveRole = user?.role || storedUser?.role;

  if (isError || effectiveRole !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
