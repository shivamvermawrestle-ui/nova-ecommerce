import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../services/productsApi";

const AdminRoute = () => {
  const { data: user, isLoading, isError } = useGetCurrentUserQuery();
  if (isLoading) {
    return <p>Checking Account</p>;
  }
  if (isError || user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
