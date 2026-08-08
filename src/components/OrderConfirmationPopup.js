function OrderConfirmationPopup({ order, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-[rgba(11,40,34,0.45)] backdrop-blur-[2px] flex items-center justify-center p-6 z-40 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-surface rounded-brand shadow-md w-full max-w-[420px] pt-9 px-7 pb-7 flex flex-col items-center text-center animate-slideUp"
        role="dialog"
        aria-modal="true"
        aria-label="Pedido confirmado"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full border-none bg-white/85 text-primary-dark text-[15px] cursor-pointer flex items-center justify-center z-[2] transition-colors hover:bg-primary-light"
          onClick={onClose}
          aria-label="Fechar"
        >
          ✕
        </button>

        <div className="text-[44px] mb-2" aria-hidden="true">
          🎉
        </div>

        <h2 className="font-display text-primary-dark m-0 mb-3 text-xl font-bold">
          Obrigado pela compra!
        </h2>

        <p className="text-ink text-sm leading-[1.6] m-0 mb-5">
          Aguardamos você em até <strong>24 horas</strong> para a retirada do
          produto e a efetuação do pagamento via <strong>Pix</strong> ou{" "}
          <strong>dinheiro</strong> no local.
        </p>

        <div className="flex flex-col gap-1 bg-primary-light rounded-brand px-4 py-3.5 mb-3 w-full text-center items-center">
          <span className="text-xs uppercase tracking-[0.04em] text-muted font-semibold">
            Código do pedido
          </span>
          <strong className="font-display text-[22px] text-primary-dark tracking-[0.04em]">
            {order.orderCode}
          </strong>
        </div>

        <button
          type="button"
          className="bg-primary text-white border-none px-4 py-[11px] rounded-full cursor-pointer font-body font-semibold text-sm w-full mt-[18px] transition-all hover:bg-primary-dark hover:-translate-y-px"
          onClick={onClose}
        >
          Entendi
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmationPopup;
