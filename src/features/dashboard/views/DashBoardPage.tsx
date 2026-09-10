import Header from "@/components/layout/Header"
import { dashboardService, type DashboardStats } from "@/features/dashboard/services/dashBoardService"
import { useEffect, useState } from "react"
import { formatCurrency } from "@/utils/currency"
import { ShoppingBag, TrendingUp, AlertTriangle, Package } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const data = await dashboardService.getStats()
        setStats(data)
      } catch {
        setError("No se pudieron cargar las estadísticas.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center">
          <p className="text-gray-500">Cargando dashboard...</p>
        </main>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center">
          <p className="text-red-600">{error ?? "Error al cargar el dashboard"}</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Panel de administración
          </p>
          <h1 className="text-3xl font-bold text-gray-950">Dashboard</h1>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">Total órdenes</p>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-950">{stats.total_orders}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">Total ventas</p>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-950">
              {formatCurrency(stats.total_sales)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-3">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">Stock bajo</p>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-950">{stats.low_stock_count}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-100 p-3">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">Valor inventario</p>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-950">
              {formatCurrency(stats.inventory_value)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* Top 5 productos */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-bold text-gray-950">Top 5 más vendidos</h2>
            <div className="mt-4 space-y-3">
              {stats.top_products.length === 0 ? (
                <p className="text-sm text-gray-500">Sin ventas todavía</p>
              ) : (
                stats.top_products.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{p.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-500">
                      {p.total_sold} vendidos
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Distribución por categoría */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-bold text-gray-950">Inventario por categoría</h2>
            <div className="mt-4 space-y-3">
              {stats.category_distribution.map((c) => (
                <div key={c.category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{c.category}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {c.total_stock} unidades
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({c.count} productos)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla stock bajo */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-gray-950">Productos con stock bajo</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left font-semibold text-gray-700">SKU</th>
                  <th className="pb-3 text-left font-semibold text-gray-700">Nombre</th>
                  <th className="pb-3 text-left font-semibold text-gray-700">Categoría</th>
                  <th className="pb-3 text-right font-semibold text-gray-700">Stock actual</th>
                  <th className="pb-3 text-right font-semibold text-gray-700">Stock mínimo</th>
                  <th className="pb-3 text-center font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.low_stock_products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No hay productos con stock bajo
                    </td>
                  </tr>
                ) : (
                  stats.low_stock_products.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 font-mono text-gray-500">{p.sku}</td>
                      <td className="py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="py-3 text-gray-500">{p.category}</td>
                      <td className="py-3 text-right font-semibold text-gray-900">
                        {p.stock_actual}
                      </td>
                      <td className="py-3 text-right text-gray-500">{p.stock_minimo}</td>
                      <td className="py-3 text-center">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          p.status === "Agotado"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}