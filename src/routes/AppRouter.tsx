
import LoginPage from "@/features/auth/views/LoginPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RegisterPage from "@/features/auth/views/RegisterPage";
import CartPage from "@/features/cart/views/CartPage";
import CheckoutPage from "@/features/cart/views/CheckoutPage";
import ProductsPage from "@/features/products/views/ProductsPage";


import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetailPage from "@/features/products/views/ProductDetailPage"

import DashboardPage from "@/features/dashboard/views/DashBoardPage";
import LandingPage from "@/features/products/views/LandingPage";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/item/:id" element={<ProductDetailPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="ADMIN">
            <DashboardPage/>
          </ProtectedRoute>
        } />
        
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
