import { useEffect, useState } from 'react'
import './App.css'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import MainContent from './components/layout/MainContent'

export type CartItem = {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

const readStoredCart = (): CartItem[] => {
  const storedCart = localStorage.getItem('cart')

  if (!storedCart) {
    return []
  }

  try {
    return JSON.parse(storedCart) as CartItem[]
  } catch {
    return []
  }
}

function App() {
  const [cart, setCart] = useState<CartItem[]>(readStoredCart)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const updateQuantity = (productId: number, change: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    )
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="app-shell">
      <Header cartCount={cartCount} />
      <MainContent
        cart={cart}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
      <Footer />
    </div>
  )
}

export default App
