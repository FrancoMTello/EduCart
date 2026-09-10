// src/features/cart/hooks/useCart.ts
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    currency: "ARS",
    style: "currency",
  }).format(value)