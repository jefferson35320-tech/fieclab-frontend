import { useState } from "react";

// Modo interativo: usuário clica para escolher uma nota de 1 a 5
function InteractiveStars({ value, onSelect, size }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      className={`star-rating interactive ${size}`}
      role="radiogroup"
      aria-label="Avalie este produto de 0 a 5 estrelas"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="star-btn"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
          onClick={() => onSelect(n)}
        >
          {n <= display ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

// Modo somente leitura: mostra a média com preenchimento proporcional
function ReadOnlyStars({ value, count, size }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const percent = Math.max(0, Math.min(100, (safeValue / 5) * 100));

  return (
    <div
      className={`star-rating readonly ${size}`}
      aria-label={`Avaliação média de ${safeValue.toFixed(1)} de 5 estrelas`}
    >
      <div className="star-display">
        <div className="stars-back" aria-hidden="true">
          ★★★★★
        </div>
        <div
          className="stars-front"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        >
          ★★★★★
        </div>
      </div>
      <span className="rating-value">{safeValue.toFixed(1)}</span>
      {typeof count === "number" && (
        <span className="rating-count">({count})</span>
      )}
    </div>
  );
}

function StarRating({ value, count, interactive = false, onSelect, size = "md" }) {
  if (interactive) {
    return <InteractiveStars value={value} onSelect={onSelect} size={size} />;
  }
  return <ReadOnlyStars value={value} count={count} size={size} />;
}

export default StarRating;
