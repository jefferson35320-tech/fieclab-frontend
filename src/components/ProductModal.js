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
    <div
      className="fixed inset-0 bg-[rgba(11,40,34,0.45)] backdrop-blur-[2px] flex items-center justify-center p-6 z-40 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-surface rounded-brand shadow-md w-full max-w-[480px] max-h-[88vh] overflow-y-auto flex flex-col animate-slideUp"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
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

        <div className="relative bg-gradient-to-br from-primary-light to-[#d5efe8] text-primary h-[200px] flex items-center justify-center rounded-t-brand">
          {outOfStock && (
            <span className="absolute top-2.5 left-2.5 bg-[#c0392b] text-white text-[11px] font-bold uppercase tracking-[0.03em] px-2.5 py-1 rounded-full z-[1]">
              Esgotado
            </span>
          )}
          <span className="text-[84px] leading-none" aria-hidden="true">
            {product.icon}
          </span>
        </div>

        <div className="p-6 flex flex-col">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.04em] text-primary-dark bg-primary-light px-2.5 py-1 rounded-full mb-2.5 w-fit">
            {product.category}
          </span>
          <h2 className="font-display text-[22px] font-bold m-0 mb-4 text-ink">
            {product.name}
          </h2>

          <StarRating value={displayRating} count={displayCount} size="md" />

          <div className="flex flex-col gap-2.5 mb-3.5">
            <label className="flex flex-col gap-1 text-xs font-semibold text-muted uppercase tracking-[0.03em]">
              <span>Tamanho</span>
              <select
                className="font-body text-sm font-medium text-ink normal-case tracking-normal px-2.5 py-[9px] rounded-lg border border-border bg-background cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1"
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
              <label className="flex flex-col gap-1 text-xs font-semibold text-muted uppercase tracking-[0.03em]">
                <span>Aroma</span>
                <select
                  className="font-body text-sm font-medium text-ink normal-case tracking-normal px-2.5 py-[9px] rounded-lg border border-border bg-background cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1"
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

          <p className="text-xl font-bold text-primary-dark m-0 mb-4">
            R$ {formatPrice(selectedSize.price)}
          </p>

          {/* ---------- estoque / adicionar ao carrinho / avise-me ---------- */}
          {outOfStock ? (
            <div className="text-[13px] font-semibold mb-3.5 text-[#c0392b]">
              <span>❌ Produto indisponível no momento</span>
            </div>
          ) : (
            <div className="text-[13px] font-semibold mb-3.5 text-[#1e7d4b]">
              <span>
                ✅ Em estoque ({product.stock}{" "}
                {product.stock === 1 ? "unidade" : "unidades"} disponíveis)
              </span>
            </div>
          )}

          {outOfStock ? (
            notifySubmitted ? (
              <p className="bg-primary-light text-primary-dark text-[13px] leading-[1.5] px-3.5 py-3 rounded-[10px] m-0 mb-[18px]">
                Prontinho! Você será avisado(a) em <strong>{notifyEmail}</strong>{" "}
                assim que o produto voltar ao estoque.
              </p>
            ) : (
              <form className="flex flex-col gap-2 mb-[18px]" onSubmit={handleNotifySubmit}>
                <label
                  className="text-[13px] font-semibold text-ink"
                  htmlFor={`notify-${product.id}`}
                >
                  Avise-me quando este produto voltar ao estoque
                </label>
                <div className="flex gap-2">
                  <input
                    id={`notify-${product.id}`}
                    type="email"
                    className="flex-1 font-body text-sm px-3 py-2.5 rounded-lg border border-border bg-background text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1"
                    placeholder="seu@email.com"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-accent text-primary-dark border-none px-[18px] py-2.5 rounded-lg font-bold text-sm cursor-pointer whitespace-nowrap transition-[filter] hover:brightness-95"
                  >
                    Avisar
                  </button>
                </div>
                {notifyError && (
                  <p className="text-[#c0392b] text-xs m-0">{notifyError}</p>
                )}
              </form>
            )
          ) : (
            <button
              type="button"
              className="bg-primary text-white border-none px-4 py-[11px] rounded-full cursor-pointer font-body font-semibold text-sm w-full mt-auto transition-all hover:bg-primary-dark hover:-translate-y-px"
              onClick={handleAddToCart}
            >
              Adicionar ao carrinho
            </button>
          )}

          {/* ---------- avaliação do usuário ---------- */}
          <div className="border-t border-b border-border py-4 my-[18px] flex flex-col gap-2.5">
            <h4 className="font-display text-[13px] font-bold uppercase tracking-[0.03em] text-primary-dark m-0">
              Avalie este produto
            </h4>
            {ratingSubmitted ? (
              <p className="text-primary-dark text-sm font-semibold m-0">
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
                  className="self-start bg-primary text-white border-none px-4 py-2 rounded-full font-body font-semibold text-[13px] cursor-pointer transition-colors hover:bg-primary-dark disabled:bg-border disabled:text-muted disabled:cursor-not-allowed"
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
            className="bg-primary-light text-primary-dark border-none px-4 py-[11px] rounded-full cursor-pointer font-body font-semibold text-sm w-full mt-3 transition-colors hover:bg-border"
            onClick={() => setShowInfo((prev) => !prev)}
            aria-expanded={showInfo}
          >
            {showInfo ? "Ocultar informações do produto" : "Informações do produto"}
          </button>

          {showInfo && (
            <div className="mt-[18px] pt-[18px] border-t border-border flex flex-col gap-3.5">
              <div>
                <h4 className="font-display text-[13px] font-bold uppercase tracking-[0.03em] text-primary-dark m-0 mb-1">
                  Como utilizar
                </h4>
                <p className="text-sm leading-[1.6] text-ink m-0">{product.howToUse}</p>
              </div>

              <div>
                <h4 className="font-display text-[13px] font-bold uppercase tracking-[0.03em] text-primary-dark m-0 mb-1">
                  Armazenamento
                </h4>
                <p className="text-sm leading-[1.6] text-ink m-0">{product.storage}</p>
              </div>

              <div>
                <h4 className="font-display text-[13px] font-bold uppercase tracking-[0.03em] text-primary-dark m-0 mb-1">
                  Precauções
                </h4>
                <p className="text-sm leading-[1.6] text-ink m-0">{product.precautions}</p>
              </div>

              <div>
                <h4 className="font-display text-[13px] font-bold uppercase tracking-[0.03em] text-primary-dark m-0 mb-1">
                  Ingredientes
                </h4>
                <p className="text-sm leading-[1.6] text-ink m-0">{product.ingredients}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
