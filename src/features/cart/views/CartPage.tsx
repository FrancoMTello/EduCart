import Header from "@/components/layout/Header";
import { formatCurrency, useCart } from "@/features/cart/hooks/useCart";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, summary, updateQuantity } = useCart();
  const isCartEmpty = cart.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              EduCart Checkout
            </p>
            <h1 className="text-3xl font-bold text-gray-950">
              Carrito de compras
            </h1>
          </div>

          <Link
            to="/"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Seguir comprando
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="hidden grid-cols-[1fr_140px_180px_140px_48px] gap-4 bg-gray-100 px-5 py-4 text-sm font-semibold text-gray-700 md:grid">
              <span>Producto</span>
              <span className="text-right">Precio</span>
              <span className="text-center">Cantidad</span>
              <span className="text-right">Subtotal</span>
              <span />
            </div>

            {isCartEmpty ? (
              <div className="px-6 py-16 text-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tu carrito esta vacio
                </h2>
                <p className="mt-2 text-gray-500">
                  Agrega productos del catalogo para iniciar tu compra.
                </p>
                <Link
                  to="/"
                  className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Ver productos
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cart.map((item) => {
                  const subtotal = item.product.price * item.quantity;

                  return (
                    <article
                      key={item.product.id}
                      className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_140px_180px_140px_48px] md:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product.imageSrc}
                          alt={item.product.imageAlt}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                        <div>
                          <h2 className="font-semibold text-gray-950">
                            {item.product.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            SKU {item.product.sku} · {item.product.category}
                          </p>
                          <p className="text-sm text-gray-500">
                            Stock disponible: {item.product.stock_actual}
                          </p>
                        </div>
                      </div>

                      <p className="text-right font-medium text-gray-900">
                        {formatCurrency(item.product.price)}
                      </p>

                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="grid h-9 w-9 place-items-center rounded-l-lg border border-gray-300 hover:bg-gray-100"
                          aria-label={`Restar unidad de ${item.product.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="grid h-9 w-12 place-items-center border-y border-gray-300 text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock_actual}
                          className="grid h-9 w-9 place-items-center rounded-r-lg border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                          aria-label={`Sumar unidad de ${item.product.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-right font-semibold text-gray-950">
                        {formatCurrency(subtotal)}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="grid h-10 w-10 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                        aria-label={`Eliminar ${item.product.name}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-bold text-gray-950">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(summary.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Impuestos</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(summary.tax)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Envio</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(summary.shipping)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {formatCurrency(summary.total)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              aria-disabled={isCartEmpty}
              className={`mt-6 flex w-full justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white ${
                isCartEmpty
                  ? "pointer-events-none bg-gray-300"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Proceder al checkout
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
