import type { Product } from "../types/Product";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart, formatCurrency } from "@/features/cart/hooks/useCart";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [message, setMessage] = useState("");
  const isOutOfStock = product.stock_actual === 0;
  const isLowStock =
    product.stock_actual > 0 && product.stock_actual <= product.stock_minimo;

  const handleAddToCart = () => {
    const result = addToCart(product);
    setMessage(result.message);
  };

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="overflow-hidden rounded-xl bg-gray-200">
        <img
          src={product.imageSrc}
          alt={product.imageAlt}
          className="h-80 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="font-medium text-gray-900">
            {product.name}
          </h3>

          <p className="text-sm text-gray-500">
            {product.category} · {product.color}
          </p>
        </div>

        <p className="font-semibold text-gray-900">
          {formatCurrency(product.price)}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isOutOfStock
              ? "bg-red-100 text-red-700"
              : isLowStock
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          {isOutOfStock
            ? "Agotado"
            : isLowStock
              ? "Ultimas unidades"
              : "Disponible"}
        </span>
        <span className="text-sm text-gray-500">
          Stock: {product.stock_actual}
        </span>
      </div>

      <button
        type="button"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        <ShoppingCart className="h-4 w-4" />
        Agregar al carrito
      </button>

      {message && (
        <p
          className={`mt-3 text-sm ${
            message.includes("agregado") ? "text-green-700" : "text-red-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ProductCard;
