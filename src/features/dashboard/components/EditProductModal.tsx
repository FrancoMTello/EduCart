// src/features/dashboard/components/EditProductModal.tsx
import { useState } from "react";
import type { Product } from "@/features/products/types/Product";
import { X, Save } from "lucide-react";

interface EditProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updatedValues: { price: number; stock_actual: number; stock_minimo: number }) => Promise<void>;
}

export default function EditProductModal({ product, isOpen, onClose, onSave }: EditProductModalProps) {
    console.log("🎨 [Modal] Props recibidas -> isOpen:", isOpen, "product:", product);
  const [price, setPrice] = useState(product.price);
  const [stockActual, setStockActual] = useState(product.stock_actual);
  const [stockMinimo, setStockMinimo] = useState(product.stock_minimo);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSave(product.id, {
        price: Number(price),
        stock_actual: Number(stockActual),
        stock_minimo: Number(stockMinimo),
      });
      onClose();
    } catch {
      alert("Error al actualizar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">Editar Inventario</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-500 font-medium">
          {product.name} <span className="font-mono text-xs text-gray-400">({product.sku})</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Precio ($)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock Actual</label>
              <input
                type="number"
                value={stockActual}
                onChange={(e) => setStockActual(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock Mínimo</label>
              <input
                type="number"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}