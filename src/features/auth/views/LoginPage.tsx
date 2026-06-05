import Header from "@/components/layout/Header";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Ingresa un email valido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const from = (location.state as { from?: { pathname: string } } | null)?.from
    ?.pathname;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = loginSchema.safeParse(formValues);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setSubmitError("");
      return;
    }

    try {
      login(validation.data.email, validation.data.password);
      navigate(from ?? "/", { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "No se pudo iniciar sesion.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto grid max-w-md px-4 py-16">
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-950">Iniciar sesion</h1>
          <p className="mt-2 text-sm text-gray-500">
            Accede para continuar con tu checkout y futuras ordenes.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                value={formValues.email}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {errors.email && (
                <span className="text-xs text-red-600">{errors.email}</span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Contraseña
              <input
                type="password"
                value={formValues.password}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {errors.password && (
                <span className="text-xs text-red-600">{errors.password}</span>
              )}
            </label>

            {submitError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Entrar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            No tenes cuenta?{" "}
            <Link className="font-semibold text-blue-600" to="/register">
              Registrate
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
