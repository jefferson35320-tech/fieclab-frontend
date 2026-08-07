function formatPrice(value) {
  return value.toFixed(2).replace(".", ",");
}

function CartSidebar({
  cart,
  isOpen,
  toggleCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  finalizeOrder,
  order,
  startNewOrder,
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={toggleCart}
      />

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleCart}>
          Fechar
        </button>

        {order ? (
          <div className="order-confirmation">
            <h2>Pedido confirmado</h2>

            <button onClick={startNewOrder}>Fazer novo pedido</button>
          </div>
        ) : (
          <>
            <h2>Carrinho</h2>

            {cart.length === 0 ? (
              <p className="sidebar-empty">Seu carrinho está vazio.</p>
            ) : (
              <>
                <ul>
                  {cart.map((item) => (
                    <li key={item.cartItemId}>
                      <div className="cart-item-info">
                        <strong>{item.name}</strong>
                        <span className="cart-item-variant">
                          {item.sizeLabel}
                          {item.aroma ? ` · ${item.aroma}` : ""}
                        </span>
                        <span className="cart-item-price">
                          R$ {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      <div className="cart-item-controls">
                        <div className="qty-stepper">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.cartItemId)}
                            aria-label="Diminuir quantidade"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.cartItemId)}
                            aria-label="Aumentar quantidade"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeFromCart(item.cartItemId)}
                        >
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="sidebar-total">
                  Total: R$ {formatPrice(total)}
                </div>

                <button onClick={finalizeOrder}>Finalizar pedido</button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default CartSidebar;
