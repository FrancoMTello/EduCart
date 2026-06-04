
import LoginPage from "@/features/auth/views/LoginPage";
import CartPage from "@/features/cart/views/CartPage";
import ProductsPage from "@/features/products/views/ProductsPage";


import { BrowserRouter, Routes, Route } from "react-router-dom";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;