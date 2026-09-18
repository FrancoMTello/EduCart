// src/features/dashboard/components/CreateProductModal.tsx
import { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import type { Product } from "@/features/products/types/Product";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (productData: Omit<Product, "id">) => Promise<void>;
}

const CATEGORIES = ["Libros", "Tecnologia", "Robotica", "Papeleria", "Cursos"];

export default function CreateProductModal({ isOpen, onClose, onCreate }: CreateProductModalProps) {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "Libros",
    price: 0,
    stock_actual: 0,
    stock_minimo: 5,
    rating: 5.0,
    color: "Azul",
    imageSrc: "",
    imageAlt: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onCreate(formData);
      onClose();
    } catch {
      alert("Error al crear el producto. Verifica los datos o el SKU.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-blue-600" />
            Nuevo Producto
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">SKU</label>
              <input
                type="text"
                name="sku"
                placeholder="LIB-001"
                value={formData.sku}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Nombre del Producto</label>
            <input
              type="text"
              name="name"
              placeholder="Ej. Kit de Robótica Arduino"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Precio ($)</label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Stock Actual</label>
              <input
                type="number"
                name="stock_actual"
                value={formData.stock_actual}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Stock Mínimo</label>
              <input
                type="number"
                name="stock_minimo"
                value={formData.stock_minimo}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">URL de la Imagen</label>
            <input
              type="url"
              name="imageSrc"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.imageSrc}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Descripción</label>
            <textarea
              name="description"
              rows={2}
              placeholder="Breve descripción del recurso académico..."
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-sm transition active:scale-95 disabled:bg-slate-300"
            >
              {isSubmitting ? "Guardando..." : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}