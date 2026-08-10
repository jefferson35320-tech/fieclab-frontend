import StarRating from "./StarRating";

function ProductCard({ product, onOpen, ratingOverride }) {
  const displayRating = ratingOverride ? ratingOverride.rating : product.rating;
  const displayCount = ratingOverride ? ratingOverride.count : product.ratingCount;
  const outOfStock = product.stock === 0;

  return (
    <button
      type="button"
      className="flex cursor-pointer flex-col items-center rounded-brand border border-line bg-surface p-[18px] text-center font-[inherit] transition hover:-translate-y-1 hover:border-primary-light hover:shadow-brand-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      onClick={() => onOpen(product)}
    >
      <div className="relative mb-4 flex h-[140px] w-full items-center justify-center rounded-[8px] bg-placeholder-gradient text-primary">
        {outOfStock && (
          <span className="absolute left-2.5 top-2.5 z-[1] rounded-full bg-danger px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Esgotado
          </span>
        )}
        <span className="text-5xl leading-none" aria-hidden="true">
          {product.icon}
        </span>
      </div>

      <h3 className="m-0 font-display text-base font-semibold text-ink">
        {product.name}
      </h3>

      <StarRating value={displayRating} count={displayCount} size="sm" />
    </button>
  );
}

export default ProductCard;
