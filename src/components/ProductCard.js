import StarRating from "./StarRating";

function ProductCard({ product, onOpen, ratingOverride }) {
  const displayRating = ratingOverride ? ratingOverride.rating : product.rating;
  const displayCount = ratingOverride ? ratingOverride.count : product.ratingCount;
  const outOfStock = product.stock === 0;

  return (
    <button
      type="button"
      className="product-card"
      onClick={() => onOpen(product)}
    >
      <div className="image-placeholder">
        {outOfStock && <span className="stock-badge">Esgotado</span>}
        <span className="product-icon" aria-hidden="true">
          {product.icon}
        </span>
      </div>

      <h3>{product.name}</h3>

      <StarRating value={displayRating} count={displayCount} size="sm" />
    </button>
  );
}

export default ProductCard;
