function formatPrice(value) {
  return value.toFixed(2).replace(".", ",");
}

const primaryBtn =
  "bg-primary text-white border-none px-4 py-[11px] rounded-full cursor-pointer font-body font-semibold text-sm w-full mt-auto transition-all hover:bg-primary-dark hover:-translate-y-px";

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
        className={`fixed inset-0 bg-[rgba(11,40,34,0.35)] transition-opacity duration-300 z-[25] ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleCart}
      />

      <div
        className={`fixed top-0 w-80 h-full bg-surface shadow-[-12px_0_30px_rgba(11,110,93,0.15)] transition-[right] duration-300 py-7 px-6 flex flex-col z-30 ${
          isOpen ? "right-0" : "right-[-360px]"
        }`}
      >
        <button
          className="bg-primary-light text-primary-dark w-auto px-3.5 py-2 self-start mb-5 rounded-full font-body font-semibold text-sm cursor-pointer border-none transition-colors hover:bg-border"
          onClick={toggleCart}
        >
          Fechar
        </button>

        {order ? (
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-primary-dark m-0 mb-3 text-xl font-bold">
              Pedido confirmado
            </h2>

            <button className={`${primaryBtn} mt-3`} onClick={startNewOrder}>
              Fazer novo pedido
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-display text-primary-dark m-0 mb-[18px] text-xl font-bold">
              Carrinho
            </h2>

            {cart.length === 0 ? (
              <p className="text-muted text-sm">Seu carrinho está vazio.</p>
            ) : (
              <>
                <ul className="list-none p-0 m-0 mb-5 flex-1 overflow-y-auto">
                  {cart.map((item) => (
                    <li
                      key={item.cartItemId}
                      className="flex flex-col gap-2.5 py-3.5 border-b border-border text-sm"
                    >
                      <div className="flex flex-col gap-0.5">
                        <strong>{item.name}</strong>
                        <span className="text-muted text-[13px]">
                          {item.sizeLabel}
                          {item.aroma ? ` · ${item.aroma}` : ""}
                        </span>
                        <span className="text-primary-dark font-bold mt-0.5">
                          R$ {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 border border-border rounded-full px-1.5 py-1">
                          <button
                            type="button"
                            className="w-[26px] h-[26px] min-h-[26px] p-0 rounded-full text-base leading-none m-0 bg-primary text-white border-none cursor-pointer transition-colors hover:bg-primary-dark"
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
                            className="w-[26px] h-[26px] min-h-[26px] p-0 rounded-full text-base leading-none m-0 bg-primary text-white border-none cursor-pointer transition-colors hover:bg-primary-dark"
                            onClick={() => increaseQuantity(item.cartItemId)}
                            aria-label="Aumentar quantidade"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="bg-transparent text-[#c0392b] border border-[#f0d3ce] w-auto px-3 py-[7px] text-[13px] m-0 rounded-full font-body font-semibold cursor-pointer transition-colors hover:bg-[#fdecea]"
                          onClick={() => removeFromCart(item.cartItemId)}
                        >
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border py-4 font-display text-[17px] text-primary-dark">
                  Total: R$ {formatPrice(total)}
                </div>

                <button
                  type="button"
                  className={`${primaryBtn} w-full mt-4`}
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
