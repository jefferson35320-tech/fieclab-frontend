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
      className="fixed inset-0 z-40 flex animate-fadeIn items-center justify-center bg-[#0b2822]/45 p-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[88vh] w-full max-w-[480px] animate-slideUp flex-col overflow-y-auto rounded-brand bg-surface shadow-brand-md"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
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

        <div className="relative flex h-[200px] items-center justify-center rounded-t-brand bg-placeholder-gradient text-primary">
          {outOfStock && (
            <span className="absolute left-2.5 top-2.5 z-[1] rounded-full bg-danger px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Esgotado
            </span>
          )}
          <span className="text-[84px] leading-none" aria-hidden="true">
            {product.icon}
          </span>
        </div>

        <div className="flex flex-col p-6">
          <span className="mb-2.5 inline-block w-fit rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-dark">
            {product.category}
          </span>
          <h2 className="m-0 mb-4 font-display text-[22px] font-bold text-ink">
            {product.name}
          </h2>

          <StarRating value={displayRating} count={displayCount} size="md" />

          <div className="mb-3.5 flex flex-col gap-2.5">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted">
              <span>Tamanho</span>
              <select
                className="cursor-pointer rounded-lg border border-line bg-page px-2.5 py-2.5 font-body text-sm font-medium normal-case tracking-normal text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
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
              <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted">
                <span>Aroma</span>
                <select
                  className="cursor-pointer rounded-lg border border-line bg-page px-2.5 py-2.5 font-body text-sm font-medium normal-case tracking-normal text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
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

          <p className="m-0 mb-4 text-xl font-bold text-primary-dark">
            R$ {formatPrice(selectedSize.price)}
          </p>

          {/* ---------- estoque / adicionar ao carrinho / avise-me ---------- */}
          {outOfStock ? (
            <div className="mb-3.5 text-sm font-semibold text-danger">
              <span>❌ Produto indisponível no momento</span>
            </div>
          ) : (
            <div className="mb-3.5 text-sm font-semibold text-success">
              <span>
                ✅ Em estoque ({product.stock}{" "}
                {product.stock === 1 ? "unidade" : "unidades"} disponíveis)
              </span>
            </div>
          )}

          {outOfStock ? (
            notifySubmitted ? (
              <p className="m-0 mb-[18px] rounded-[10px] bg-primary-light px-3.5 py-3 text-[13px] leading-relaxed text-primary-dark">
                Prontinho! Você será avisado(a) em <strong>{notifyEmail}</strong>{" "}
                assim que o produto voltar ao estoque.
              </p>
            ) : (
              <form
                className="mb-[18px] flex flex-col gap-2"
                onSubmit={handleNotifySubmit}
              >
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
                    className="flex-1 rounded-lg border border-line bg-page px-3 py-2.5 font-body text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                    placeholder="seu@email.com"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="whitespace-nowrap rounded-lg bg-accent px-[18px] py-2.5 text-sm font-bold text-white transition hover:brightness-95"
                  >
                    Avisar
                  </button>
                </div>
                {notifyError && (
                  <p className="m-0 text-xs text-danger">{notifyError}</p>
                )}
              </form>
            )
          ) : (
            <button
              type="button"
              className="mt-auto w-full rounded-full border-none bg-primary px-4 py-[11px] font-body text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-primary-dark"
              onClick={handleAddToCart}
            >
              Adicionar ao carrinho
            </button>
          )}

          {/* ---------- avaliação do usuário ---------- */}
          <div className="my-[18px] flex flex-col gap-2.5 border-y border-line py-4">
            <h4 className="m-0 font-display text-[13px] font-bold uppercase tracking-wide text-primary-dark">
              Avalie este produto
            </h4>
            {ratingSubmitted ? (
              <p className="m-0 text-sm font-semibold text-primary-dark">
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
                  className="self-start rounded-full border-none bg-primary px-4 py-2 font-body text-[13px] font-semibold text-white transition enabled:hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
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
            className="mt-3 w-full rounded-full border-none bg-primary-light px-4 py-[11px] font-body text-sm font-semibold text-primary-dark transition hover:bg-line"
            onClick={() => setShowInfo((prev) => !prev)}
            aria-expanded={showInfo}
          >
            {showInfo ? "Ocultar informações do produto" : "Informações do produto"}
          </button>

          {showInfo && (
            <div className="mt-[18px] flex flex-col gap-3.5 border-t border-line pt-[18px]">
              <div>
                <h4 className="m-0 mb-1 font-display text-[13px] font-bold uppercase tracking-wide text-primary-dark">
                  Como utilizar
                </h4>
                <p className="m-0 text-sm leading-relaxed text-ink">
                  {product.howToUse}
                </p>
              </div>

              <div>
                <h4 className="m-0 mb-1 font-display text-[13px] font-bold uppercase tracking-wide text-primary-dark">
                  Armazenamento
                </h4>
                <p className="m-0 text-sm leading-relaxed text-ink">
                  {product.storage}
                </p>
              </div>

              <div>
                <h4 className="m-0 mb-1 font-display text-[13px] font-bold uppercase tracking-wide text-primary-dark">
                  Precauções
                </h4>
                <p className="m-0 text-sm leading-relaxed text-ink">
                  {product.precautions}
                </p>
              </div>

              <div>
                <h4 className="m-0 mb-1 font-display text-[13px] font-bold uppercase tracking-wide text-primary-dark">
                  Ingredientes
                </h4>
                <p className="m-0 text-sm leading-relaxed text-ink">
                  {product.ingredients}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
