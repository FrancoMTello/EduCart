type HeaderProps = {
  cartCount: number
}

export default function Header({ cartCount }: HeaderProps) {
  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <a className="brand" href="/">
          <span className="brand-icon" aria-hidden="true">
            ED
          </span>
          EduCart
        </a>

        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/products">Products</a>
          </li>
          <li>
            <a className="cart-link" href="/cart" aria-label="Shopping cart">
              Cart
              <span className="cart-counter">{cartCount}</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
