// src/features/dashboard/components/OrdersTable.tsx
import { useState } from "react";
import type { OrderDTO } from "../services/orderServices";
import { formatCurrency } from "@/utils/currency";
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import React from "react";

interface OrdersTableProps {
  orders: OrderDTO[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const toggleOrder = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Historial de Órdenes Registradas</h2>
          <p className="text-xs text-gray-500">Consulta los detalles e ítems de cada compra realizada</p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <th className="pb-3">ID Órden</th>
              <th className="pb-3">Fecha</th>
              <th className="pb-3 text-center">Estado</th>
              <th className="pb-3 text-right">Total</th>
              <th className="pb-3 text-center">Unidades</th>
              <th className="pb-3 text-right">Detalle</th>
            </tr>
          </thead>
<tbody className="divide-y divide-gray-100">
  {orders.length === 0 ? (
    <tr>
      <td colSpan={6} className="py-8 text-center text-gray-400">
        No hay órdenes registradas aún.
      </td>
    </tr>
  ) : (
    orders.map((order) => {
      const isExpanded = expandedOrderId === order.id;

      return (
        // 💡 Usamos React.Fragment en lugar de un <tr className="contents">
        <React.Fragment key={order.id}>
          <tr className="hover:bg-gray-50/50 transition">
            <td className="py-3 font-mono text-xs font-bold text-blue-600">
              #EC-{order.id.toString().padStart(4, "0")}
            </td>
            <td className="py-3 text-xs text-gray-500">
              {new Date(order.created_at).toLocaleDateString("es-AR")}
            </td>
            <td className="py-3 text-center">
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-100">
                {order.status}
              </span>
            </td>
            <td className="py-3 text-right font-bold text-gray-900">
              {formatCurrency(order.total)}
            </td>
            <td className="py-3 text-center text-xs font-medium text-gray-600">
              {order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0} un.
            </td>
            <td className="py-3 text-right">
              <button
                type="button"
                onClick={() => toggleOrder(order.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                {isExpanded ? "Ocultar" : "Ver ítems"}
                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </td>
          </tr>

          {/* Fila del desplegable independiente en el mismo nivel */}
          {isExpanded && (
            <tr className="bg-gray-50/70">
              <td colSpan={6} className="p-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-blue-600" />
                    Productos de la Órden #EC-{order.id.toString().padStart(4, "0")}
                  </h4>
                  <div className="divide-y divide-gray-100">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between py-2 text-xs">
                        <span className="font-medium text-gray-800">
                          {item.quantity}x {item.product_name}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.subtotal ?? item.product_price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    })
  )}
</tbody>
        </table>
      </div>
    </div>
  );
}