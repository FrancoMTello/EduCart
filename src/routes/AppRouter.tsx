
import LoginPage from "@/features/auth/views/LoginPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import RegisterPage from "@/features/auth/views/RegisterPage";
import CartPage from "@/features/cart/views/CartPage";
import CheckoutPage from "@/features/cart/views/CheckoutPage";
import ProductsPage from "@/features/products/views/ProductsPage";


import { BrowserRouter, Routes, Route } from "react-router-dom";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
