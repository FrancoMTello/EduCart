import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

// El tipo de cada item del carrito
type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
}

// El estado inicial — el carrito empieza vacío
type CartState = {
  items: CartItem[]
}

const initialState: CartState = {
  items: []
}

const cartSlice = createSlice({
  name: "cart",           // nombre del slice
  initialState,           // estado inicial
  reducers: {             // las acciones posibles

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(item => item.id === action.payload.id)
      if (existing) {
        existing.quantity += 1  // si ya existe, suma 1
      } else {
        state.items.push(action.payload)  // si no, lo agrega
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },

    clearCart: (state) => {
      state.items = []
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
    const item = state.items.find(item => item.id === action.payload.id)
      if (!item) return
      if (action.payload.quantity <= 0) {
      state.items = state.items.filter(item => item.id !== action.payload.id)
    } else {
      item.quantity = action.payload.quantity
  }
}
  }
})

// Exportás las acciones para usarlas en los componentes
export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions

// Exportás el reducer para el store
export default cartSlice.reducer