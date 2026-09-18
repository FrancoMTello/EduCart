import Header from "@/components/layout/Header"
import { Link } from "react-router-dom"

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
  return (

    <div className="w-screen overflow-x-hidden">
    <div>
      <Header/>

      {/* Hero Banner en bloque independiente */}
      {/* Hero Banner */}


<section className="w-full bg-blue-600 p-11">
  
  {/* 💡 1. Quitamos 'flex' de este contenedor para dejar que 'mx-auto' y 'text-center' hagan su trabajo limpio en bloque */}
  <div className="mx-auto w-full max-w-4xl px-6 text-center">
    
    {/* Título */}
    <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl text-white">
      EduCart
    </h1>

    {/* 💡 2. 'mx-auto' + 'text-center' + 'block' le da el centrado perfecto al párrafo */}
    <p className="mx-auto mt-4 block max-w-xl text-center text-base font-normal text-blue-100 sm:text-lg leading-relaxed  align-middle">
      Todo lo que necesitás para aprender, en un solo lugar. Libros, tecnología, robótica y más.
    </p>

    {/* 💡 3. Este contenedor engloba al botón y lo centra con flex */}
    <div className="mt-8 flex justify-center">
      <Link
        to="/products"
        className="inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-600 shadow-md hover:bg-blue-50 active:scale-95 transition-all"
      >
        Ver Catálogo
      </Link>
    </div>

  </div>
</section>

      {/* Categorías */}
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

      {/* CTA final */}
      <section className="bg-gray-50 px-4 py-16 text-center">
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

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} EduCart. Todos los derechos reservados.
      </footer>
    </div>
    </div>
  )
}