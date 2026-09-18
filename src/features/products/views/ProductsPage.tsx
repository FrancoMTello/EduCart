import Header from "@/components/layout/Header"
import ProductCard from "../components/ProductCard"
import { productService } from "../services/productService"
import type { Product } from "../types/Product"
import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"

const categories = ["Todas", "Libros", "Tecnologia", "Robotica", "Papeleria", "Cursos"]

const ProductsPage = () => {
  // Estado para los productos de la API
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get("category")
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl ?? "Todas")
  const [maxPrice, setMaxPrice] = useState(999999)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("default")

  // Carga los productos de la API al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🚀 Cargando productos...")
        setIsLoading(true)
        const data = await productService.getAll()
         console.log("Productos recibidos:", data)
        setProducts(data)
      } catch (err) {
        console.error(err)
        setError("No se pudieron cargar los productos.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const maxCatalogPrice = products.length > 0
    ? Math.max(...products.map((p) => p.price))
    : 999999

  const filteredProducts = useMemo(() => {

    let result = [...products]

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (selectedCategory !== "Todas") {
      result = result.filter((p) => p.category === selectedCategory)
    }
    result = result.filter((p) => p.price <= maxPrice)
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating)
    }

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break
      case "price-desc": result.sort((a, b) => b.price - a.price); break
      case "alpha": result.sort((a, b) => a.name.localeCompare(b.name)); break
      case "rating": result.sort((a, b) => b.rating - a.rating); break
    }

    return result
  }, [products, search, selectedCategory, maxPrice, minRating, sortBy])

  // Mientras carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center">
          <p className="text-gray-500">Cargando productos...</p>
        </main>
      </div>
    )
  }

  // Si hay error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center">
          <p className="text-red-600">{error}</p>
        </main>
      </div>
    )
  }
      console.log("filteredProducts:", filteredProducts)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900">Filtros</h2>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Categoría</p>
                <div className="mt-2 flex flex-col gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700">
                  Precio máximo: ${maxPrice.toLocaleString("es-AR")}
                </p>
                <input
                  type="range"
                  min={0}
                  max={maxCatalogPrice}
                  step={1}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-2 w-full accent-blue-600"
                />
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700">Rating mínimo</p>
                <div className="mt-2 flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`rounded-lg px-1 py-1 text-sm font-medium transition ${
                        minRating === r
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {r === 0 ? "Todos" : `${r}★`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSearch("")
                  setSelectedCategory("Todas")
                  setMaxPrice(maxCatalogPrice)
                  setMinRating(0)
                  setSortBy("default")
                }}
                className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Limpiar filtros
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {filteredProducts.length} productos encontrados
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
              >
                <option value="default">Ordenar por</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="alpha">Alfabético</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
                <p className="text-lg font-semibold text-gray-900">
                  No se encontraron productos
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Probá con otros filtros o términos de búsqueda
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductsPage