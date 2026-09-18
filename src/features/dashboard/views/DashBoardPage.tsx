// src/features/dashboard/views/DashboardPage.tsx
import Header from "@/components/layout/Header";
import { dashboardService, type DashboardStats } from "../services/dashBoardService";
import { productService } from "@/features/products/services/productService";
import { orderService, type OrderDTO } from "../services/orderServices";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/currency";
import { ShoppingBag, TrendingUp, AlertTriangle, Package, Edit3 } from "lucide-react";
import EditProductModal from "../components/EditProductModal";
import OrdersTable from "../components/OrdersTable";
import type { Product } from "@/features/products/types/Product";

import { Plus } from "lucide-react";
import CreateProductModal from "../components/CrearProductModal";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Carga paralela de métricas, catálogo completo e historial de órdenes
      const [statsData, productsData, ordersData] = await Promise.all([
        dashboardService.getStats(),
        productService.getAll(),
        orderService.getAll(),
      ]);
      setStats(statsData);
      setAllProducts(productsData);
      setOrders(ordersData);
    } catch {
      setError("No se pudieron cargar los datos del dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleEditClick = async (productId: number) => {
    try {
      setIsFetchingProduct(true);
      const fullProduct = await productService.getById(productId);
      setSelectedProduct(fullProduct);
    } catch {
      alert("No se pudo obtener la información completa del producto.");
    } finally {
      setIsFetchingProduct(false);
    }
  };

  const handleUpdateProduct = async (
    id: number,
    updatedValues: { price: number; stock_actual: number; stock_minimo: number }
  ) => {
    await productService.update(id, updatedValues);
    await loadDashboardData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-gray-500">Cargando métricas de administración...</p>
        </main>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-16 text-center">
          <p className="text-red-600 font-medium">{error ?? "Error al cargar el dashboard"}</p>
        </main>
      </div>
    );
  }

  const handleCreateProduct = async (productData: Omit<Product, "id">) => {
  await productService.create(productData);
  await loadDashboardData(); // Refresca las métricas y la tabla en tiempo real
};
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      {/* Gestion de elementos*/}
      <main className="mx-auto max-w-7xl px-6 py-10">

{/* Graficas y Estadísticas de productos*/}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Panel de Control
            </span>
            <h1 className="mt-1 text-3xl font-extrabold text-gray-900">Dashboard & Inventario</h1>
          </div>
        </div>

        {/* Tarjetas KPIs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Total Órdenes</span>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-gray-900">{stats.total_orders}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Ventas Totales</span>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-gray-900">{formatCurrency(stats.total_sales)}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Stock Bajo / Crítico</span>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-gray-900">{stats.low_stock_count}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Valor del Inventario</span>
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-gray-900">{formatCurrency(stats.inventory_value)}</p>
          </div>
        </div>
        {/* Top 5 y Distribución */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Top 5 Productos Más Vendidos</h2>
            <div className="mt-4 divide-y divide-gray-100">
              {stats.top_products.length === 0 ? (
                <p className="py-4 text-sm text-gray-400">Sin órdenes registradas</p>
              ) : (
                stats.top_products.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                        0{i + 1}
                      </span>
                      <span className="text-sm font-semibold text-gray-800">{p.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {p.total_sold} vendidas
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Distribución de Inventario</h2>
            <div className="mt-4 divide-y divide-gray-100">
              {stats.category_distribution.map((c) => (
                <div key={c.category} className="flex items-center justify-between py-3">
                  <span className="text-sm font-semibold text-gray-800">{c.category}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{c.total_stock} un.</span>
                    <span className="ml-2 text-xs text-gray-400">({c.count} productos)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


{/* Agregar un nuevo producto*/}
        <div className="flex items-center justify-between border-gray-100 bg-white  p-8 shadow-sm rounded-2xl mt-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ingreso de Productos </h2>
            <p className="text-xs text-slate-500">Agrega un nuevo producto </p>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition active:scale-95 cursor-pointer">
          <Plus className="h-4 w-4" />Nuevo Producto </button>
          </div>
    {isCreateModalOpen && (
      <CreateProductModal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      onCreate={handleCreateProduct}
  />
)}

        {/* Tabla de Gestión de Inventario Completo */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Gestión General de Inventario</h2>
              <p className="text-xs text-gray-500">Edita el stock o precio de cualquier producto en tiempo real</p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Producto</th>
                  <th className="pb-3">Categoría</th>
                  <th className="pb-3 text-right">Stock Actual</th>
                  <th className="pb-3 text-right">Stock Mín.</th>
                  <th className="pb-3 text-center">Estado</th>
                  <th className="pb-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No hay productos registrados en el inventario.
                    </td>
                  </tr>
                ) : (
                  allProducts.map((p) => {
                    const isOutOfStock = p.stock_actual === 0;
                    const isLowStock = p.stock_actual > 0 && p.stock_actual <= p.stock_minimo;
                    const statusText = isOutOfStock ? "Agotado" : isLowStock ? "Stock bajo" : "Normal";

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-3 font-mono text-xs font-medium text-gray-500">{p.sku}</td>
                        <td className="py-3 font-semibold text-gray-900">{p.name}</td>
                        <td className="py-3 text-xs text-gray-500">{p.category}</td>
                        <td className="py-3 text-right font-bold text-gray-900">{p.stock_actual}</td>
                        <td className="py-3 text-right text-xs text-gray-400">{p.stock_minimo}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              isOutOfStock
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : isLowStock
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            }`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            disabled={isFetchingProduct}
                            onClick={() => handleEditClick(p.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition cursor-pointer disabled:opacity-50"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla de Historial de Órdenes */}
        <OrdersTable orders={orders} />
      </main>

      {/* Modal de Edición */}
      {selectedProduct && (
        <EditProductModal
          key={selectedProduct.id}
          product={selectedProduct}
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          onSave={handleUpdateProduct}
        />
      )}
    </div>
  );
}