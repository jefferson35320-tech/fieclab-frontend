import StarRating from "./StarRating";

function ProductCard({ product, onOpen, ratingOverride }) {
  const displayRating = ratingOverride ? ratingOverride.rating : product.rating;
  const displayCount = ratingOverride ? ratingOverride.count : product.ratingCount;
  const outOfStock = product.stock === 0;

  return (
    <button
      type="button"
      className="bg-surface border border-border rounded-brand p-[18px] flex flex-col items-center [font-family:inherit] text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      onClick={() => onOpen(product)}
    >
      <div className="relative w-full bg-gradient-to-br from-primary-light to-[#d5efe8] text-primary h-[140px] rounded-brand-sm flex items-center justify-center mb-4">
        {outOfStock && (
          <span className="absolute top-2.5 left-2.5 bg-[#c0392b] text-white text-[11px] font-bold uppercase tracking-[0.03em] px-2.5 py-1 rounded-full z-[1]">
            Esgotado
          </span>
        )}
        <span className="text-5xl leading-none" aria-hidden="true">
          {product.icon}
        </span>
      </div>

      <h3 className="font-display text-base font-semibold m-0 text-ink">{product.name}</h3>

      <StarRating value={displayRating} count={displayCount} size="sm" />
    </button>
  );
}

export default ProductCard;
