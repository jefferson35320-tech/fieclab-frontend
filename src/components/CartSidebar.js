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
        className={`fixed inset-0 z-[25] bg-[#0b2822]/35 transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={toggleCart}
      />

      <div
        className={`fixed top-0 z-30 flex h-full w-80 flex-col bg-surface px-6 py-7 shadow-sidebar transition-[right] duration-300 ${
          isOpen ? "right-0" : "-right-[360px]"
        }`}
      >
        <button
          className="mb-5 w-auto self-start rounded-full bg-primary-light px-3.5 py-2 font-body text-sm font-semibold text-primary-dark transition hover:bg-line"
          onClick={toggleCart}
        >
          Fechar
        </button>

        {order ? (
          <div className="flex flex-col gap-1">
            <h2 className="mb-3 font-display text-primary-dark">Pedido confirmado</h2>

            <button
              className="mt-auto w-full rounded-full border-none bg-primary px-4 py-[11px] font-body text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-primary-dark"
              onClick={startNewOrder}
            >
              Fazer novo pedido
            </button>
          </div>
        ) : (
          <>
            <h2 className="mb-[18px] font-display text-primary-dark">Carrinho</h2>

            {cart.length === 0 ? (
              <p className="text-sm text-muted">Seu carrinho está vazio.</p>
            ) : (
              <>
                <ul className="m-0 mb-5 flex-1 list-none overflow-y-auto p-0">
                  {cart.map((item) => (
                    <li
                      key={item.cartItemId}
                      className="flex flex-col gap-2.5 border-b border-line py-3.5 text-sm"
                    >
                      <div className="flex flex-col gap-0.5">
                        <strong>{item.name}</strong>
                        <span className="text-[13px] text-muted">
                          {item.sizeLabel}
                          {item.aroma ? ` · ${item.aroma}` : ""}
                        </span>
                        <span className="mt-0.5 font-bold text-primary-dark">
                          R$ {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 rounded-full border border-line px-1.5 py-1">
                          <button
                            type="button"
                            className="flex h-[26px] w-[26px] items-center justify-center rounded-full border-none bg-primary p-0 font-body text-base font-semibold leading-none text-white transition hover:-translate-y-px hover:bg-primary-dark"
                            onClick={() => decreaseQuantity(item.cartItemId)}
                            aria-label="Diminuir quantidade"
                          >
                            −
                          </button>
                          <span className="min-w-[18px] text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="flex h-[26px] w-[26px] items-center justify-center rounded-full border-none bg-primary p-0 font-body text-base font-semibold leading-none text-white transition hover:-translate-y-px hover:bg-primary-dark"
                            onClick={() => increaseQuantity(item.cartItemId)}
                            aria-label="Aumentar quantidade"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="w-auto rounded-full border border-[#f0d3ce] bg-transparent px-3 py-[7px] font-body text-[13px] font-semibold text-danger transition hover:bg-[#fdecea]"
                          onClick={() => removeFromCart(item.cartItemId)}
                        >
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line py-4 font-display text-[17px] text-primary-dark">
                  Total: R$ {formatPrice(total)}
                </div>

                <button
                  className="mt-auto w-full rounded-full border-none bg-primary px-4 py-[11px] font-body text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-primary-dark"
                  onClick={finalizeOrder}
                >
                  Finalizar pedido
                </button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default CartSidebar;
