import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import AdminProductEditor from "./AdminProductEditor";

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",");
}

function priceRange(sizes) {
  if (sizes.length === 0) return "—";
  const prices = sizes.map((s) => s.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max
    ? `R$ ${formatPrice(min)}`
    : `R$ ${formatPrice(min)} – ${formatPrice(max)}`;
}

function AdminProductsList({
  products,
  categories,
  onSaveProduct,
  onSaveStock,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [query, setQuery] = useState("");

  const visible = products.filter((product) =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou categoria"
          className="w-full rounded-full border border-line bg-page py-2.5 pl-10 pr-4 font-body text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
        />
      </div>

      <p className="m-0 mb-3 text-[13px] text-muted">
        {visible.length} {visible.length === 1 ? "produto" : "produtos"}
      </p>

      <ul className="m-0 flex flex-1 list-none flex-col gap-3 overflow-y-auto p-0 pb-4">
        {visible.length === 0 && (
          <li className="py-8 text-center text-sm text-muted">
            Nenhum produto encontrado.
          </li>
        )}

        {visible.map((product) => {
          const isOpen = expandedId === product.id;
          const outOfStock = product.stock <= 0;

          return (
            <li
              key={product.id}
              className="shrink-0 overflow-hidden rounded-brand border border-line bg-surface"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setExpandedId(isOpen ? null : product.id)}
                className="flex w-full cursor-pointer items-center gap-3.5 border-none bg-transparent p-3 text-left font-[inherit] transition hover:bg-primary-light/50"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-brand-sm bg-placeholder-gradient text-2xl">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt=""
                      className="h-full w-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span aria-hidden="true">{product.icon}</span>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <strong className="truncate font-display text-[15px] text-ink">
                    {product.name}
                  </strong>
                  <span className="text-xs text-muted">
                    {product.category} · {priceRange(product.sizes)}
                  </span>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                    outOfStock
                      ? "bg-danger text-white"
                      : "bg-primary-light text-primary-dark"
                  }`}
                >
                  {outOfStock
                    ? product.stock < 0
                      ? `Esgotado (${product.stock})`
                      : "Esgotado"
                    : `${product.stock} em estoque`}
                </span>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <AdminProductEditor
                  product={product}
                  categories={categories}
                  onSave={(fields) => onSaveProduct(product.id, fields)}
                  onSaveStock={(stock) => onSaveStock(product.id, stock)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default AdminProductsList;
