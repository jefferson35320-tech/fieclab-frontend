import { useState } from "react";

const INTERACTIVE_STAR_SIZE = {
  lg: "text-[30px]",
  md: "text-[22px]",
};

const READONLY_STAR_SIZE = {
  sm: "text-sm",
  md: "text-base",
};

// Modo interativo: usuário clica para escolher uma nota de 1 a 5
function InteractiveStars({ value, onSelect, size }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      className="flex items-center gap-0.5"
      role="radiogroup"
      aria-label="Avalie este produto de 0 a 5 estrelas"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`cursor-pointer border-none bg-none p-0.5 leading-none text-accent ${
            INTERACTIVE_STAR_SIZE[size] || INTERACTIVE_STAR_SIZE.md
          }`}
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
  const starSize = READONLY_STAR_SIZE[size] || READONLY_STAR_SIZE.md;
  const wrapperMargin = size === "sm" ? "mt-1.5" : "my-1 mb-[18px]";

  return (
    <div
      className={`flex items-center gap-1.5 text-sm ${wrapperMargin}`}
      aria-label={`Avaliação média de ${safeValue.toFixed(1)} de 5 estrelas`}
    >
      <div className="relative inline-block leading-none">
        <div
          className={`whitespace-nowrap tracking-[2px] text-line ${starSize}`}
          aria-hidden="true"
        >
          ★★★★★
        </div>
        <div
          className={`absolute left-0 top-0 overflow-hidden whitespace-nowrap tracking-[2px] text-accent ${starSize}`}
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        >
          ★★★★★
        </div>
      </div>
      <span className="text-[0.85em] font-bold text-ink">
        {safeValue.toFixed(1)}
      </span>
      {typeof count === "number" && (
        <span className="text-[0.85em] text-muted">({count})</span>
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
