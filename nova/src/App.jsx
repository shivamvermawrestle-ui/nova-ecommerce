import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./Components/Common/Navbar";

// User Pages (Categorized)
// Home
const Home = lazy(() => import("./Pages/Home/Home"));
const OurStory = lazy(() => import("./Pages/Home/OurStory"));

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
const AdminOrderDetails = lazy(() => import("./Admin/Orders/AdminOrderDetails"));
const AdminUser = lazy(() => import("./Admin/Users/AdminUser"));

// Loading Component
const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading page...</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Navbar />

        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/ourstory" element={<OurStory />} />
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

          {/* Admin Routes */}
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
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
