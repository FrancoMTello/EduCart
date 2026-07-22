import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "../cart/slice/cartSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer  // el carrito vive en store.cart
  }
})

// Tipos útiles para TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch