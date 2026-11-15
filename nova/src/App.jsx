import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import ScrollToTop from "./Components/Common/ScrollToTop";

// User Pages (Categorized)
// Home
const Home = lazy(() => import("./Pages/Home/Home"));

// Auth
const Login = lazy(() => import("./Pages/Auth/Login"));
const Signup = lazy(() => import("./Pages/Auth/Signup"));

// Product
const Shop = lazy(() => import("./Pages/Product/Shop"));
const ProductDetails = lazy(() => import("./Pages/Product/ProductDetails"));
const Wishlist = lazy(() => import("./Pages/Product/Wishlist"));

// Order & Checkout
const Cart = lazy(() => import("./Pages/Order/Cart"));
const Orders = lazy(() => import("./Pages/Order/Orders"));
const OrderDetails = lazy(() => import("./Pages/Order/OrderDetails"));
const PaymentSuccess = lazy(() => import("./Pages/Order/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./Pages/Order/PaymentCancel"));

// Admin Pages (Categorized)
const AdminRoute = lazy(() => import("./Admin/Layout/AdminRoute"));
const AdminLayout = lazy(() => import("./Admin/Layout/AdminLayout"));
const AdminDashboard = lazy(() => import("./Admin/Dashboard/AdminDashboard"));
const AdminProducts = lazy(() => import("./Admin/Products/AdminProducts"));
const AddProduct = lazy(() => import("./Admin/Products/AddProduct"));
const ProductEdit = lazy(() => import("./Admin/Products/ProductEdit"));
const AdminOrders = lazy(() => import("./Admin/Orders/AdminOrders"));
const AdminOrderDetails = lazy(
  () => import("./Admin/Orders/AdminOrderDetails"),
);
const AdminUser = lazy(() => import("./Admin/Users/AdminUser"));
///////////
const NotFound = lazy(() => import("./Pages/NotFound"));
///////////
// Loading Component
const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-4 border-[#D8E1EF] border-t-[#202C50] dark:border-[#35435C] dark:border-t-[#7895C5] rounded-full animate-spin" />
        <p className="text-[#64718A] dark:text-[#AAB8D0] text-sm font-medium">
          Loading page...
        </p>
      </div>
    </div>
  );
};
const StoreLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const App = () => {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <ScrollToTop />
        <Routes>
          <Route element={<StoreLayout />}>
            {/*  user routes  */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />

            {/* admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="products/:id/edit" element={<ProductEdit />} />
                <Route path="users" element={<AdminUser />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetails />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
