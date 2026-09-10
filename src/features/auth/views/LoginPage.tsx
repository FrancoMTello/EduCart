import Header from "@/components/layout/Header"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Ingresa un email valido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, error, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({})

  // Página de origen — para volver después del login
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Valida el formato con Zod
    const validation = loginSchema.safeParse(formValues)
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      })
      return
    }

    setFieldErrors({})

    // Espera el resultado y navega solo si fue exitoso
    const result = await login(validation.data.email, validation.data.password)
    if (result.meta.requestStatus === "fulfilled") {
      navigate(from ?? "/", { replace: true })
    }
  }

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
                  setFormValues((current) => ({ ...current, email: event.target.value }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {fieldErrors.email && (
                <span className="text-xs text-red-600">{fieldErrors.email}</span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-medium text-gray-700">
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
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isLoading ? "Ingresando..." : "Entrar"}
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
  )
}