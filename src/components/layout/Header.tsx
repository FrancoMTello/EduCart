
import { ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";


export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link to="/">
          <h1 className="text-2xl font-bold text-blue-600">
            EduCart
          </h1>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600">
            Products
          </Link>

          <Link to="/cart">
            <ShoppingCart />
          </Link>

          <Link to="/login">
            <User />
          </Link>
        </nav>
      </div>
    </header>
  );
};
