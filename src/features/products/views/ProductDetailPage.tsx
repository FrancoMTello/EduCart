import Header from "@/components/layout/Header"

import { formatCurrency } from "@/utils/currency"
import { useParams, useNavigate } from "react-router-dom"

import { ShoppingCart, ArrowLeft, Star } from "lucide-react"


import { productService } from "@/features/products/services/productService"
import { useState, useEffect } from "react"
import type { Product } from "@/features/products/types/Product"

// Redux
import { useDispatch } from "react-redux"
import { addToCart } from "@/features/cart/slice/cartSlice"
import type { AppDispatch } from "@/store/store"

export default function ProductDetailPage() {
  // Lee el :id de la URL — siempre viene como string
  const { id } = useParams()
  const navigate = useNavigate()
    // Agrega al carrito con la cantidad seleccionada
  const dispatch = useDispatch<AppDispatch>()

  // Cantidad seleccionada — empieza en 1
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState("")

  // Busca el producto por id — convierte string a number con Number()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      setIsLoading(true)

      const data = await productService.getById(Number(id))

      setProduct(data)

    } catch (err) {
      console.error(err)
      setError("Producto no encontrado")
    } finally {
      setIsLoading(false)
    }
  }

  if (id) {
    fetchProduct()
  }

}, [id])
  // Si el producto no existe muestra un mensaje y un botón para volver
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center">
          <p className="text-xl font-semibold text-gray-900">Producto no encontrado</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Volver al catálogo
          </button>
        </main>
      </div>
    )
  }
  if (isLoading) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p>Cargando producto...</p>
      </main>
    </div>
  )
}


if (error || !product) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-xl font-semibold">
          {error || "Producto no encontrado"}
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Volver
        </button>
      </main>
    </div>
  )
}

  // Lógica de stock — igual que en ProductCard
  const isOutOfStock = product.stock_actual === 0
  const isLowStock = product.stock_actual > 0 && product.stock_actual <= product.stock_minimo



const handleAddToCart = () => {
  dispatch(addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: quantity
  }))
  setMessage("Producto agregado al carrito.")
  setTimeout(() => setMessage(""), 3000)
}

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">

        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Imagen */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <img
              src={typeof product.imageSrc === 'string' ? product.imageSrc : ''}
              alt={product.imageAlt}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Info del producto */}
          <div className="flex flex-col gap-6">

            {/* Categoría y nombre */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                {product.category}
              </p>
              <h1 className="mt-1 text-4xl font-bold text-gray-950">
                {product.name}
              </h1>
            </div>

            {/* Rating — muestra estrellas según el valor */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < product.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">{product.rating}/5</span>
            </div>

            {/* Precio */}
            <p className="text-3xl font-bold text-gray-950">
              {formatCurrency(product.price)}
            </p>

            {/* Badge de stock */}
            <span className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${
              isOutOfStock
                ? "bg-red-100 text-red-700"
                : isLowStock
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
            }`}>
              {isOutOfStock
                ? "Agotado"
                : isLowStock
                  ? `Últimas ${product.stock_actual} unidades`
                  : `${product.stock_actual} disponibles`}
            </span>

            {/* Selector de cantidad */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Cantidad</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="grid h-9 w-9 place-items-center rounded-l-lg border border-gray-300 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="grid h-9 w-12 place-items-center border-y border-gray-300 text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock_actual, q + 1))}
                    className="grid h-9 w-9 place-items-center rounded-r-lg border border-gray-300 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Botón agregar al carrito */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? "Sin stock" : "Agregar al carrito"}
            </button>

            {/* Mensaje de confirmación */}
            {message && (
              <p className={`text-sm font-medium ${
                message.includes("agregado") ? "text-green-700" : "text-red-700"
              }`}>
                {message}
              </p>
            )}

            {/* Detalles extra */}
            <div className="border-t border-gray-200 pt-6">
              <dl className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">SKU</dt>
                  <dd className="font-medium text-gray-900">{product.sku}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Color</dt>
                  <dd className="font-medium text-gray-900">{product.color}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Categoría</dt>
                  <dd className="font-medium text-gray-900">{product.category}</dd>
                </div>
              </dl>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}