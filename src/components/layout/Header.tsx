import { useAuth } from "@/features/auth/hooks/useAuth"
import { useSelector } from "react-redux"
import type { RootState } from "../../store/store"
import { LogOut, ShoppingCart, LayoutDashboard } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"

export default function Header() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const itemCount = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  )

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Resalta el link activo según la ruta actual
  const isActive = (path: string) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600"

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/">
        <span className="text-xl font-bold text-gray-950">
          Edu<span className="text-blue-600">Cart</span>
          </span>
        </Link>

        {/* Links de navegación */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/" className={isActive("/")}>
            Inicio
          </Link>
          <Link to="/products" className={isActive("/products")}>
            Productos
          </Link>
          {user?.role === "ADMIN" && (
            <Link to="/admin/dashboard" className={`flex items-center gap-1.5 ${isActive("/admin/dashboard")}`}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-3">

          {/* Carrito */}
          <Link
            to="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            aria-label="Carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Usuario logueado */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-medium text-gray-900">
                  {user.first_name}
                </span>
                <span className="text-xs text-gray-400">{user.role}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600"
                aria-label="Cerrar sesion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-blue-600"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}