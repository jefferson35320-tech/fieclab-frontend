import { useState } from "react";

// Modo interativo: usuário clica para escolher uma nota de 1 a 5
function InteractiveStars({ value, onSelect, size }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  const starSizeClass = size === "lg" ? "text-[30px]" : "text-[22px]";

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
          className={`bg-transparent border-none p-0.5 cursor-pointer text-accent leading-none ${starSizeClass}`}
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

  const wrapperClass =
    size === "sm" ? "mt-1.5 text-[13px]" : "my-1 mb-[18px] text-base";
  const starClass = size === "sm" ? "text-[14px]" : "text-[18px]";

  return (
    <div
      className={`flex items-center gap-1.5 ${wrapperClass}`}
      aria-label={`Avaliação média de ${safeValue.toFixed(1)} de 5 estrelas`}
    >
      <div className={`relative inline-block leading-none ${starClass}`}>
        <div className="text-border whitespace-nowrap tracking-[2px]" aria-hidden="true">
          ★★★★★
        </div>
        <div
          className="absolute top-0 left-0 overflow-hidden whitespace-nowrap text-accent tracking-[2px]"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        >
          ★★★★★
        </div>
      </div>
      <span className="font-bold text-ink text-[0.85em]">{safeValue.toFixed(1)}</span>
      {typeof count === "number" && (
        <span className="text-muted text-[0.85em]">({count})</span>
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
