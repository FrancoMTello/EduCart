import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "@/features/cart/slice/cartSlice"
import type { RootState, AppDispatch } from "../../store/store"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/features/cart/hooks/useCart"

export default function ProductCard({ product }: {
  product: {
    id: number
    name: string
    price: number
    category: string
    color: string
    imageSrc: string
    imageAlt: string
    stock_actual: number
    stock_minimo: number
  }
}) {
  const dispatch = useDispatch<AppDispatch>()

  const inCart = useSelector((state: RootState) =>
    state.cart.items.find(item => item.id === product.id)
  )

  const isOutOfStock = product.stock_actual === 0
  const isLowStock = product.stock_actual > 0 && product.stock_actual <= product.stock_minimo

  function handleAddToCart() {
    if (isOutOfStock) return
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    }))
  }

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
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category} · {product.color}</p>
        </div>
        <p className="font-semibold text-gray-900">{formatCurrency(product.price)}</p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          isOutOfStock
            ? "bg-red-100 text-red-700"
            : isLowStock
              ? "bg-amber-100 text-amber-700"
              : "bg-green-100 text-green-700"
        }`}>
          {isOutOfStock ? "Agotado" : isLowStock ? "Ultimas unidades" : "Disponible"}
        </span>
        <span className="text-sm text-gray-500">Stock: {product.stock_actual}</span>
      </div>

      <button
        type="button"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
          inCart
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        } disabled:cursor-not-allowed disabled:bg-gray-300`}
      >
        <ShoppingCart className="h-4 w-4" />
        {inCart ? "Ya en el carrito" : "Agregar al carrito"}
      </button>
    </div>
  )
}