function OrderConfirmationPopup({ order, onClose }) {
  return (
    <div
      className="fixed inset-0 z-40 flex animate-fadeIn items-center justify-center bg-[#0b2822]/45 p-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-[420px] animate-slideUp flex-col items-center rounded-brand bg-surface px-7 pb-7 pt-9 text-center shadow-brand-md"
        role="dialog"
        aria-modal="true"
        aria-label="Pedido confirmado"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3.5 top-3.5 z-[2] flex h-8 w-8 items-center justify-center rounded-full border-none bg-white/85 text-[15px] text-primary-dark transition hover:bg-primary-light"
          onClick={onClose}
          aria-label="Fechar"
        >
          ✕
        </button>

        <div className="mb-2 text-[44px]" aria-hidden="true">
          🎉
        </div>

        <h2 className="font-display text-primary-dark">Obrigado pela compra!</h2>

        <p className="m-0 mb-5 text-sm leading-relaxed text-ink">
          Aguardamos você em até <strong>24 horas</strong> para a retirada do
          produto e a efetuação do pagamento via <strong>Pix</strong> ou{" "}
          <strong>dinheiro</strong> no local.
        </p>

        <div className="mb-3 flex w-full flex-col items-center gap-1 rounded-brand bg-primary-light px-4 py-3.5 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Código do pedido
          </span>
          <strong className="font-display text-[22px] tracking-wide text-primary-dark">
            {order.orderCode}
          </strong>
        </div>

        <button
          type="button"
          className="mt-[18px] w-full rounded-full border-none bg-primary px-4 py-[11px] font-body text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-primary-dark"
          onClick={onClose}
        >
          Entendi
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmationPopup;
