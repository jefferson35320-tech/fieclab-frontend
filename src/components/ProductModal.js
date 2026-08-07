import { useState } from "react";
import StarRating from "./StarRating";

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ProductModal({ product, onClose, addToCart, ratingOverride, onRate }) {
  const [selectedSizeId, setSelectedSizeId] = useState(product.sizes[0].id);
  const [selectedAroma, setSelectedAroma] = useState(
    product.aromas.length > 0 ? product.aromas[0] : ""
  );
  const [showInfo, setShowInfo] = useState(false);

  const [myRating, setMyRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [notifyError, setNotifyError] = useState("");

  const selectedSize = product.sizes.find((s) => s.id === selectedSizeId);
  const outOfStock = product.stock === 0;

  const displayRating = ratingOverride ? ratingOverride.rating : product.rating;
  const displayCount = ratingOverride ? ratingOverride.count : product.ratingCount;

  function handleAddToCart() {
    const cartItemId = `${product.id}-${selectedSize.id}-${
      selectedAroma || "sem-aroma"
    }`;

    addToCart({
      cartItemId,
      productId: product.id,
      name: product.name,
      sizeLabel: selectedSize.label,
      aroma: selectedAroma,
      price: selectedSize.price,
      quantity: 1,
    });

    onClose();
  }

  function handleSubmitRating() {
    if (myRating === 0) return;
    onRate(product.id, myRating);
    setRatingSubmitted(true);
  }

  function handleNotifySubmit(e) {
    e.preventDefault();

    if (!EMAIL_REGEX.test(notifyEmail)) {
      setNotifyError("Digite um e-mail válido.");
      return;
    }

    setNotifyError("");
    setNotifySubmitted(true);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
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

        <div className="modal-image">
          {outOfStock && <span className="stock-badge">Esgotado</span>}
          <span className="product-icon" aria-hidden="true">
            {product.icon}
          </span>
        </div>

        <div className="modal-content">
          <span className="modal-category-tag">{product.category}</span>
          <h2>{product.name}</h2>

          <StarRating value={displayRating} count={displayCount} size="md" />

          <div className="product-options">
            <label className="product-option">
              <span>Tamanho</span>
              <select
                value={selectedSizeId}
                onChange={(e) => setSelectedSizeId(e.target.value)}
              >
                {product.sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.label}
                  </option>
                ))}
              </select>
            </label>

            {product.aromas.length > 0 && (
              <label className="product-option">
                <span>Aroma</span>
                <select
                  value={selectedAroma}
                  onChange={(e) => setSelectedAroma(e.target.value)}
                >
                  {product.aromas.map((aroma) => (
                    <option key={aroma} value={aroma}>
                      {aroma}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <p className="modal-price">R$ {formatPrice(selectedSize.price)}</p>

          {/* ---------- estoque / adicionar ao carrinho / avise-me ---------- */}
          {outOfStock ? (
            <div className="stock-info stock-unavailable">
              <span>❌ Produto indisponível no momento</span>
            </div>
          ) : (
            <div className="stock-info stock-available">
              <span>
                ✅ Em estoque ({product.stock}{" "}
                {product.stock === 1 ? "unidade" : "unidades"} disponíveis)
              </span>
            </div>
          )}

          {outOfStock ? (
            notifySubmitted ? (
              <p className="notify-confirmation">
                Prontinho! Você será avisado(a) em <strong>{notifyEmail}</strong>{" "}
                assim que o produto voltar ao estoque.
              </p>
            ) : (
              <form className="notify-form" onSubmit={handleNotifySubmit}>
                <label className="notify-label" htmlFor={`notify-${product.id}`}>
                  Avise-me quando este produto voltar ao estoque
                </label>
                <div className="notify-row">
                  <input
                    id={`notify-${product.id}`}
                    type="email"
                    className="notify-input"
                    placeholder="seu@email.com"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="notify-btn">
                    Avisar
                  </button>
                </div>
                {notifyError && <p className="notify-error">{notifyError}</p>}
              </form>
            )
          ) : (
            <button
              type="button"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Adicionar ao carrinho
            </button>
          )}

          {/* ---------- avaliação do usuário ---------- */}
          <div className="rate-product-section">
            <h4>Avalie este produto</h4>
            {ratingSubmitted ? (
              <p className="rating-thankyou">
                Obrigado por avaliar! Sua nota: {myRating}★
              </p>
            ) : (
              <>
                <StarRating
                  value={myRating}
                  onSelect={setMyRating}
                  interactive
                  size="lg"
                />
                <button
                  type="button"
                  className="submit-rating-btn"
                  onClick={handleSubmitRating}
                  disabled={myRating === 0}
                >
                  Enviar avaliação
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            className="info-toggle-btn"
            onClick={() => setShowInfo((prev) => !prev)}
            aria-expanded={showInfo}
          >
            {showInfo ? "Ocultar informações do produto" : "Informações do produto"}
          </button>

          {showInfo && (
            <div className="product-info-panel">
              <div className="info-block">
                <h4>Como utilizar</h4>
                <p>{product.howToUse}</p>
              </div>

              <div className="info-block">
                <h4>Armazenamento</h4>
                <p>{product.storage}</p>
              </div>

              <div className="info-block">
                <h4>Precauções</h4>
                <p>{product.precautions}</p>
              </div>

              <div className="info-block">
                <h4>Ingredientes</h4>
                <p>{product.ingredients}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
