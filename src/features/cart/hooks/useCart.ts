import { useCallback, useMemo, useSyncExternalStore } from "react";
import { products } from "@/features/products/data/products";
import type { Product } from "@/features/products/types/Product";
import type { CartItem } from "@/features/cart/types/CartItem";

const CART_STORAGE_KEY = "educart.cart";
const CART_UPDATED_EVENT = "educart:cart-updated";
const TAX_RATE = 0.08;
const SHIPPING_COST = 9.99;
const FREE_SHIPPING_LIMIT = 100000;

type CartActionResult = {
  ok: boolean;
  message: string;
};

let cartSnapshot: CartItem[] | null = null;

const notifyCartUpdated = () => {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

const normalizeCart = (items: CartItem[]) =>
  items
    .map((item) => {
      const freshProduct = products.find(
        (product) => product.id === item.product.id,
      );

      if (!freshProduct || freshProduct.stock_actual <= 0) {
        return null;
      }

      return {
        product: freshProduct,
        quantity: Math.min(Math.max(item.quantity, 1), freshProduct.stock_actual),
      };
    })
    .filter((item): item is CartItem => Boolean(item));

const readCart = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) {
    return [];
  }

  try {
    return normalizeCart(JSON.parse(storedCart) as CartItem[]);
  } catch {
    return [];
  }
};

const getCartSnapshot = () => {
  cartSnapshot ??= readCart();
  return cartSnapshot;
};

const writeCart = (cart: CartItem[]) => {
  cartSnapshot = normalizeCart(cart);
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartSnapshot));
  notifyCartUpdated();
};

const subscribeToCart = (callback: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) {
      cartSnapshot = readCart();
      callback();
    }
  };

  window.addEventListener(CART_UPDATED_EVENT, callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    currency: "ARS",
    style: "currency",
  }).format(value);

export const useCart = () => {
  const cart = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => []);

  const addToCart = useCallback(
    (product: Product, quantity = 1): CartActionResult => {
      if (product.stock_actual <= 0) {
        return {
          ok: false,
          message: "Este producto está agotado.",
        };
      }

      const currentCart = readCart();
      const currentItem = currentCart.find(
        (item) => item.product.id === product.id,
      );
      const currentQuantity = currentItem?.quantity ?? 0;
      const requestedQuantity = currentQuantity + quantity;

      if (requestedQuantity > product.stock_actual) {
        return {
          ok: false,
          message: `Solo hay ${product.stock_actual} unidades disponibles.`,
        };
      }

      const nextCart = currentItem
        ? currentCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: requestedQuantity }
              : item,
          )
        : [...currentCart, { product, quantity }];

      writeCart(nextCart);

      return {
        ok: true,
        message: "Producto agregado al carrito.",
      };
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number): CartActionResult => {
      const currentCart = readCart();
      const currentItem = currentCart.find(
        (item) => item.product.id === productId,
      );

      if (!currentItem) {
        return {
          ok: false,
          message: "El producto no está en el carrito.",
        };
      }

      if (quantity <= 0) {
        writeCart(currentCart.filter((item) => item.product.id !== productId));

        return {
          ok: true,
          message: "Producto eliminado del carrito.",
        };
      }

      if (quantity > currentItem.product.stock_actual) {
        return {
          ok: false,
          message: `Solo hay ${currentItem.product.stock_actual} unidades disponibles.`,
        };
      }

      writeCart(
        currentCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      );

      return {
        ok: true,
        message: "Cantidad actualizada.",
      };
    },
    [],
  );

  const removeFromCart = useCallback((productId: number) => {
    writeCart(readCart().filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    writeCart([]);
  }, []);

  const summary = useMemo(() => {
    const subtotal = cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    const shipping =
      subtotal > 0 && subtotal < FREE_SHIPPING_LIMIT ? SHIPPING_COST : 0;
    const tax = subtotal * TAX_RATE;

    return {
      itemCount: cart.reduce((total, item) => total + item.quantity, 0),
      shipping,
      subtotal,
      tax,
      total: subtotal + shipping + tax,
    };
  }, [cart]);

  return {
    addToCart,
    cart,
    clearCart,
    removeFromCart,
    summary,
    updateQuantity,
  };
};
