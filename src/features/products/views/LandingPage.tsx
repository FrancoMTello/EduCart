import Header from "@/components/layout/Header"
import { Link } from "react-router-dom"

import ProductCard from "@/features/products/components/ProductCard"
import { productService } from "@/features/products/services/productService"
import type { Product } from "@/features/products/types/Product"
import { useEffect, useState } from "react"


// Categorías con descripción e ícono emoji
const categories = [
  {
    name: "Libros",
    description: "Los mejores libros para potenciar tu aprendizaje",
    emoji: "📚",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-700",
  },
  {
    name: "Tecnologia",
    description: "Herramientas tecnológicas para estudiantes modernos",
    emoji: "💻",
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-700",
  },
  {
    name: "Robotica",
    description: "Kits y componentes para aprender robótica",
    emoji: "🤖",
    color: "bg-green-50 border-green-200",
    textColor: "text-green-700",
  },
  {
    name: "Papeleria",
    description: "Todo lo que necesitás para organizarte y estudiar",
    emoji: "✏️",
    color: "bg-amber-50 border-amber-200",
    textColor: "text-amber-700",
  },
  {
    name: "Cursos",
    description: "Cursos digitales para aprender a tu ritmo",
    emoji: "🎓",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-700",
  },
]

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // Productos destacados — los 4 con mayor rating

  const featuredProducts = [...products]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 4)

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error("Error cargando productos:", error)
    } finally {
      setIsLoading(false)
    }
  }
  fetchProducts()
  }, [])

  if (isLoading) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-20 text-center">
        <p className="text-gray-500">
          Cargando productos destacados...
        </p>
      </main>
    </div>
  )
}
  

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-linear-to-br from-blue-600 to-blue-800 px-4 py-20 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
          Bienvenido a
        </p>
        <h1 className="mt-2 text-5xl font-bold">EduCart</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
          Todo lo que necesitás para aprender, en un solo lugar.
          Libros, tecnología, robótica y más.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/products"
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            Ver catálogo
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Crear cuenta
          </Link>
        </div>
      </section>

      {/* Categorías destacadas */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Explorá por categoría
          </h2>
          <p className="mt-2 text-gray-500">
            Encontrá exactamente lo que buscás
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              // Navega a /products con el filtro de categoría en la URL
              to={`/products?category=${cat.name}`}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition hover:-translate-y-1 hover:shadow-md ${cat.color}`}
            >
              <span className="text-4xl">{cat.emoji}</span>
              <p className={`font-semibold ${cat.textColor}`}>{cat.name}</p>
              <p className="text-xs text-gray-500">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Más valorados
              </h2>
              <p className="mt-2 text-gray-500">
                Los productos mejor calificados por nuestros estudiantes
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Ver todos →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900">
            ¿Listo para empezar?
          </h2>
          <p className="mt-4 text-gray-500">
            Creá tu cuenta gratis y empezá a comprar hoy mismo.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Registrarme gratis
          </Link>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} EduCart. Todos los derechos reservados.
      </footer>
    </div>
  )
}