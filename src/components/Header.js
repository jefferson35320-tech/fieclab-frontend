function Header({ cartCount, toggleCart }) {
  return (
    <div className="header">
      <div className="header-brand">
        <span className="dot" />
        Fiec<span>Lab</span>
      </div>

      <div className="cart-icon" onClick={toggleCart}>
        🛒 Carrinho
        <span className="cart-count">{cartCount}</span>
      </div>
    </div>
  );
}

export default Header;
