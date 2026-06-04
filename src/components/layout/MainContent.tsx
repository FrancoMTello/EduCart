type CartItem = {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

type MainContentProps = {
  cart: CartItem[]
  onRemoveFromCart: (productId: number) => void
  onUpdateQuantity: (productId: number, change: number) => void
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(price)

export default function MainContent({
  cart,
  onRemoveFromCart,
  onUpdateQuantity,
}: MainContentProps) {
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 9.99) : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax
  const isCartEmpty = cart.length === 0

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!')
  }

  return (
    <main className="main-content">
      <h1>Your Shopping Cart</h1>

      <div className="cart-layout">
        <section className="cart-panel" aria-label="Cart products">
          <div className="cart-table">
            <div className="cart-table-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            {isCartEmpty ? (
              <div className="empty-cart">
                <div className="empty-cart-icon" aria-hidden="true">
                  Cart
                </div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet</p>
                <a className="primary-link" href="/products">
                  Browse Products
                </a>
              </div>
            ) : (
              <div className="cart-items">
                {cart.map((item) => {
                  const itemTotal = item.price * item.quantity

                  return (
                    <article className="cart-item" key={item.id}>
                      <div className="cart-product">
                        <img src={item.image} alt={item.name} />
                        <div>
                          <h2>{item.name}</h2>
                          <button
                            className="remove-button"
                            type="button"
                            onClick={() => onRemoveFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="cart-price">{formatPrice(item.price)}</div>

                      <div className="quantity-control">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() => onUpdateQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => onUpdateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-total">{formatPrice(itemTotal)}</div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <aside className="summary-panel" aria-label="Order summary">
          <h2>Order Summary</h2>

          <div className="summary-lines">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{formatPrice(shipping)}</strong>
            </div>
            <div>
              <span>Tax</span>
              <strong>{formatPrice(tax)}</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          <button
            className="checkout-button"
            type="button"
            disabled={isCartEmpty}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

          <p>or</p>

          <a className="continue-shopping" href="/products">
            Continue Shopping
          </a>
        </aside>
      </div>
    </main>
  )
}
