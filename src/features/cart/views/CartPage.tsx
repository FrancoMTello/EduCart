'use client'




import Header from "@/components/layout/Header";


import ProductCard from "@/features/products/components/ProductCard";

import { products } from "@/features/products/data/products";
const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Productos
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;