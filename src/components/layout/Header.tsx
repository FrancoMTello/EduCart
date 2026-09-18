// src/components/layout/Header.tsx
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { LogOut, ShoppingCart, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const itemCount = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-blue-600 font-bold"
      : "text-slate-600 hover:text-blue-600 font-medium";

  return (
    // 💡 py-6 (o py-7) incrementa la altura vertical. min-h-[88px] asegura una altura consistente.
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 min-h-[68px]">
        
        {/* Logo más amplio */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:opacity-90 transition">
            Edu<span className="text-blue-600">Cart</span>
          </span>
        </Link>

        {/* Links de navegación */}
        <nav className="hidden items-center gap-8 text-base md:flex">
          <Link to="/" className={isActive("/")}>
            Inicio
          </Link>
          <Link to="/products" className={isActive("/products")}>
            Productos
          </Link>
          {user?.role === "ADMIN" && (
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-2 ${isActive("/admin/dashboard")}`}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          {/* Carrito */}
          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
            aria-label="Carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white shadow-xs">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Usuario / Sesión */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-bold text-slate-900">
                  {user.first_name}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-sm transition active:scale-[0.98]"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}