import Header from "@/components/layout/Header";
import { formatCurrency, useCart } from "@/features/cart/hooks/useCart";
import { useForm } from "@tanstack/react-form";
import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

const checkoutSchema = z
  .object({
    firstName: z.string().min(2, "Ingresa al menos 2 caracteres."),
    lastName: z.string().min(2, "Ingresa al menos 2 caracteres."),
    phone: z.string().min(8, "Ingresa un telefono valido."),
    email: z.string().email("Ingresa un email valido."),
    confirmEmail: z.string().email("Confirma un email valido."),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Los emails deben coincidir.",
    path: ["confirmEmail"],
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const defaultValues: CheckoutFormValues = {
  confirmEmail: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
};

const getFieldError = (
  values: CheckoutFormValues,
  fieldName: keyof CheckoutFormValues,
) => checkoutSchema.safeParse(values).error?.flatten().fieldErrors[fieldName]?.[0];

const CheckoutPage = () => {
  const { cart, clearCart, summary } = useCart();
  const [orderId, setOrderId] = useState("");
  const [submitError, setSubmitError] = useState("");
  const isCartEmpty = cart.length === 0;

  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      const validation = checkoutSchema.safeParse(value);

      if (!validation.success) {
        setSubmitError("Revisa los datos del formulario antes de continuar.");
        return;
      }

      setSubmitError("");
      setOrderId(`EC-${Date.now().toString().slice(-6)}`);
      clearCart();
    },
  });

  const orderLines = useMemo(
    () =>
      cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      })),
    [cart],
  );

  if (orderId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-950">
              Compra confirmada
            </h1>
            <p className="mt-3 text-gray-500">
              Tu orden {orderId} fue generada correctamente.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Volver al catalogo
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-950">
            Checkout seguro
          </h1>
          <p className="mt-2 text-gray-500">
            Completa tus datos para validar la orden.
          </p>

          {isCartEmpty ? (
            <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <h2 className="text-lg font-semibold text-gray-950">
                No hay productos para comprar
              </h2>
              <Link
                to="/"
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Ver catalogo
              </Link>
            </div>
          ) : (
            <form
              className="mt-8 grid gap-5 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <form.Field name="firstName">
                {(field) => (
                  <label className="grid gap-2 text-sm font-medium text-gray-700">
                    Nombre
                    <input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <form.Subscribe selector={(state) => state.values}>
                      {(values) => {
                        const error = getFieldError(values, "firstName");
                        return error ? (
                          <span className="text-xs text-red-600">{error}</span>
                        ) : null;
                      }}
                    </form.Subscribe>
                  </label>
                )}
              </form.Field>

              <form.Field name="lastName">
                {(field) => (
                  <label className="grid gap-2 text-sm font-medium text-gray-700">
                    Apellido
                    <input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <form.Subscribe selector={(state) => state.values}>
                      {(values) => {
                        const error = getFieldError(values, "lastName");
                        return error ? (
                          <span className="text-xs text-red-600">{error}</span>
                        ) : null;
                      }}
                    </form.Subscribe>
                  </label>
                )}
              </form.Field>

              <form.Field name="phone">
                {(field) => (
                  <label className="grid gap-2 text-sm font-medium text-gray-700">
                    Telefono
                    <input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <form.Subscribe selector={(state) => state.values}>
                      {(values) => {
                        const error = getFieldError(values, "phone");
                        return error ? (
                          <span className="text-xs text-red-600">{error}</span>
                        ) : null;
                      }}
                    </form.Subscribe>
                  </label>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <label className="grid gap-2 text-sm font-medium text-gray-700">
                    Email
                    <input
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <form.Subscribe selector={(state) => state.values}>
                      {(values) => {
                        const error = getFieldError(values, "email");
                        return error ? (
                          <span className="text-xs text-red-600">{error}</span>
                        ) : null;
                      }}
                    </form.Subscribe>
                  </label>
                )}
              </form.Field>

              <form.Field name="confirmEmail">
                {(field) => (
                  <label className="grid gap-2 text-sm font-medium text-gray-700 sm:col-span-2">
                    Confirmar email
                    <input
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <form.Subscribe selector={(state) => state.values}>
                      {(values) => {
                        const error = getFieldError(values, "confirmEmail");
                        return error ? (
                          <span className="text-xs text-red-600">{error}</span>
                        ) : null;
                      }}
                    </form.Subscribe>
                  </label>
                )}
              </form.Field>

              {submitError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:col-span-2"
              >
                Confirmar compra
              </button>
            </form>
          )}
        </section>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-950">
            Resumen de orden
          </h2>

          <div className="mt-5 space-y-4">
            {orderLines.map((line) => (
              <div key={line.id} className="flex justify-between gap-4 text-sm">
                <span className="text-gray-600">
                  {line.quantity} x {line.name}
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(line.total)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-gray-200 pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">
                {formatCurrency(summary.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Impuestos</span>
              <span className="font-semibold">{formatCurrency(summary.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Envio</span>
              <span className="font-semibold">
                {formatCurrency(summary.shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-blue-600">
                {formatCurrency(summary.total)}
              </span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CheckoutPage;
