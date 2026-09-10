import Header from "@/components/layout/Header"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Ingresa un email valido."),
  firstName: z.string().min(2, "Ingresa al menos 2 caracteres."),
  lastName: z.string().min(2, "Ingresa al menos 2 caracteres."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register, error, isLoading } = useAuth()
  const navigate = useNavigate()

  const [formValues, setFormValues] = useState<RegisterFormValues>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterFormValues, string>>>({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Valida el formato con Zod
    const validation = registerSchema.safeParse(formValues)
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      setFieldErrors({
        email: errors.email?.[0],
        firstName: errors.firstName?.[0],
        lastName: errors.lastName?.[0],
        password: errors.password?.[0],
      })
      return
    }

    setFieldErrors({})

    // Espera el resultado y navega solo si fue exitoso
    const result = await register(
      validation.data.firstName,
      validation.data.lastName,
      validation.data.email,
      validation.data.password,
    )
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/", { replace: true })
    }
  }

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
                  setFormValues((current) => ({ ...current, firstName: event.target.value }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {fieldErrors.firstName && (
                <span className="text-xs text-red-600">{fieldErrors.firstName}</span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Apellido
              <input
                value={formValues.lastName}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, lastName: event.target.value }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {fieldErrors.lastName && (
                <span className="text-xs text-red-600">{fieldErrors.lastName}</span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-medium text-gray-700 sm:col-span-2">
              Email
              <input
                type="email"
                value={formValues.email}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, email: event.target.value }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {fieldErrors.email && (
                <span className="text-xs text-red-600">{fieldErrors.email}</span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-medium text-gray-700 sm:col-span-2">
              Contraseña
              <input
                type="password"
                value={formValues.password}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, password: event.target.value }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {fieldErrors.password && (
                <span className="text-xs text-red-600">{fieldErrors.password}</span>
              )}
            </label>

            {/* Error del servidor — viene del store */}
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:col-span-2"
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
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
  )
}