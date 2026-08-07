function OrderConfirmationPopup({ order, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="order-popup"
        role="dialog"
        aria-modal="true"
        aria-label="Pedido confirmado"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Fechar"
        >
          ✕
        </button>

        <div className="order-popup-icon" aria-hidden="true">
          🎉
        </div>

        <h2>Obrigado pela compra!</h2>

        <p className="order-popup-message">
          Aguardamos você em até <strong>24 horas</strong> para a retirada do
          produto e a efetuação do pagamento via <strong>Pix</strong> ou{" "}
          <strong>dinheiro</strong> no local.
        </p>

        <div className="order-detail">
          <span>Código do pedido</span>
          <strong>{order.orderCode}</strong>
        </div>

        <button type="button" className="order-popup-close-btn" onClick={onClose}>
          Entendi
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmationPopup;
