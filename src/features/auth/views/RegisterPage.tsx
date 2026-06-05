import Header from "@/components/layout/Header";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Ingresa un email valido."),
  firstName: z.string().min(2, "Ingresa al menos 2 caracteres."),
  lastName: z.string().min(2, "Ingresa al menos 2 caracteres."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<RegisterFormValues>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormValues, string>>>({});
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = registerSchema.safeParse(formValues);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
        password: fieldErrors.password?.[0],
      });
      setSubmitError("");
      return;
    }

    try {
      register(
        validation.data.firstName,
        validation.data.lastName,
        validation.data.email,
        validation.data.password,
      );
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "No se pudo crear la cuenta.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto grid max-w-lg px-4 py-16">
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-950">Crear cuenta</h1>
          <p className="mt-2 text-sm text-gray-500">
            Registra tu usuario para comprar y conservar tus datos de sesion.
          </p>

          <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Nombre
              <input
                value={formValues.firstName}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    firstName: event.target.value,
                  }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {errors.firstName && (
                <span className="text-xs text-red-600">{errors.firstName}</span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Apellido
              <input
                value={formValues.lastName}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    lastName: event.target.value,
                  }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {errors.lastName && (
                <span className="text-xs text-red-600">{errors.lastName}</span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-medium text-gray-700 sm:col-span-2">
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

            <label className="grid gap-2 text-sm font-medium text-gray-700 sm:col-span-2">
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
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:col-span-2"
            >
              Crear cuenta
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Ya tenes cuenta?{" "}
            <Link className="font-semibold text-blue-600" to="/login">
              Inicia sesion
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
