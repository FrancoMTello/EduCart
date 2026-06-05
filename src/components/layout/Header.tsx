import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCart } from "@/features/cart/hooks/useCart";
import { LogOut, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const { logout, user } = useAuth();
  const { summary } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link to="/">
          <h1 className="text-2xl font-bold text-blue-600">EduCart</h1>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600">
            Products
          </Link>

          <Link to="/cart" className="relative hover:text-blue-600">
            <ShoppingCart />
            {summary.itemCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white">
                {summary.itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-gray-500 sm:inline">
                {user.firstName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg p-2 hover:bg-gray-100 hover:text-blue-600"
                aria-label="Cerrar sesion"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-blue-600" aria-label="Login">
              <User />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
