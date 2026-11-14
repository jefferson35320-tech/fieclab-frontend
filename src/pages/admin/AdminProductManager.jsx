import { useMemo, useState } from "react";
import { Check, Edit3, Image as ImageIcon, Search, Trash2, X } from "lucide-react";

import { CATEGORIAS, imageSrc, typeLabel } from "../../data/productMapper";
import { productService } from "../../services/productService";

const inputClass =
  "w-full rounded-brand-sm border border-line bg-page px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

const labelClass = "flex flex-col gap-1.5 text-xs font-semibold text-muted";

function formatPrice(value) {
  return `R$ ${Number(value || 0)
    .toFixed(2)
    .replace(".", ",")}`;
}

function toDraft(product) {
  return {
    name: product.name || "",
    price: String(product.sizes?.[0]?.price ?? ""),
    categoria: product.categoria || "OUTROS",
    description: product.description || "",
    ativo: product.ativo !== false,
    quantidade: String(product.stock ?? 0),
    quantidadeMinima: String(product.stockMin ?? 0),
    imagem: product.imagem || "",
    fispq: product.fispq || "",
    dataFabricacao: product.dataFabricacao || "",
    validade: product.validade || "",
  };
}

// corpo no formato do ProductDTO aceito pelo backend
function toPayload(draft) {
  return {
    name: draft.name.trim(),
    price: Number(draft.price),
    description: draft.description.trim() || null,
    ativo: draft.ativo,
    dataFabricacao: draft.dataFabricacao || null,
    validade: draft.validade || null,
    fispq: draft.fispq.trim() || null,
    imagem: draft.imagem.trim() || null,
    categoria: draft.categoria,
    estoque: {
      quantidade: Number(draft.quantidade) || 0,
      quantidadeMinima: Number(draft.quantidadeMinima) || 0,
    },
  };
}

function mergeUpdated(product, updated) {
  return {
    ...product,
    ...updated,
    name: updated.name ?? product.name,
    description: updated.description || "",
    ativo: updated.ativo !== false,
    categoria: updated.categoria ?? product.categoria,
    category: typeLabel(updated.categoria ?? product.categoria),
    imagem: updated.imagem || "",
    image: imageSrc(updated.imagem),
    fispq: updated.fispq || "",
    dataFabricacao: updated.dataFabricacao ?? product.dataFabricacao,
    validade: updated.validade ?? product.validade,
    stock: updated.estoque?.quantidade ?? product.stock,
    stockMin: updated.estoque?.quantidadeMinima ?? product.stockMin,
    sizes: [
      {
        id: "unidade",
        label: "Unidade",
        price: Number(updated.price ?? product.sizes?.[0]?.price ?? 0),
      },
    ],
  };
}

export default function AdminProductManager({ products, onProductsChange }) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(term)
    );
  }, [products, query]);

  const stats = useMemo(
    () => ({
      active: products.filter((product) => product.ativo !== false).length,
      outOfStock: products.filter((product) => Number(product.stock) <= 0).length,
    }),
    [products]
  );

  function startEditing(product) {
    setEditingId(product.id);
    setDraft(toDraft(product));
    setFormError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setDraft(null);
    setFormError("");
  }

  async function saveProduct() {
    const price = Number(draft.price);
    if (!draft.name.trim()) {
      setFormError("Informe o nome do produto.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setFormError("Informe um preço válido maior que zero.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const updated = await productService.update(editingId, toPayload(draft));
      onProductsChange((current) =>
        current.map((product) =>
          product.id === editingId ? mergeUpdated(product, updated) : product
        )
      );
      cancelEditing();
    } catch (error) {
      const status = error.response?.status;
      setFormError(
        status === 401 || status === 403
          ? "Sua sessão não tem permissão para alterar produtos."
          : "Não foi possível salvar o produto. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(product) {
    const payload = { ...toDraft(product), ativo: product.ativo === false };
    try {
      const updated = await productService.update(product.id, toPayload(payload));
      onProductsChange((current) =>
        current.map((item) =>
          item.id === product.id ? mergeUpdated(item, updated) : item
        )
      );
    } catch {
      setFormError("Não foi possível alterar a disponibilidade do produto.");
    }
  }

  async function removeProduct(product) {
    try {
      await productService.delete(product.id);
      onProductsChange((current) => current.filter((item) => item.id !== product.id));
    } catch {
      setFormError("Não foi possível excluir o produto.");
    } finally {
      setConfirmDelete(null);
    }
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-brand border border-line bg-surface p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Catálogo
          </span>
          <strong className="mt-1 block font-display text-2xl text-primary-dark">
            {products.length} produtos
          </strong>
        </div>
        <div className="rounded-brand border border-line bg-surface p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Publicados
          </span>
          <strong className="mt-1 block font-display text-2xl text-success">
            {stats.active}
          </strong>
        </div>
        <div className="rounded-brand border border-line bg-surface p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Sem estoque
          </span>
          <strong className="mt-1 block font-display text-2xl text-warning">
            {stats.outOfStock}
          </strong>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou categoria"
            className={`${inputClass} rounded-full pl-10`}
          />
        </div>
      </div>

      {formError && (
        <p role="alert" className="text-sm font-semibold text-danger">
          {formError}
        </p>
      )}

      <div className="overflow-x-auto rounded-brand border border-line bg-surface">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead className="bg-page text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Publicado</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((product) => (
              <tr key={product.id} className="border-t border-line align-middle">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-brand-sm bg-placeholder-gradient">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="h-full w-full object-contain p-1"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted" />
                      )}
                    </div>
                    <strong className="truncate font-display text-ink">
                      {product.name}
                    </strong>
                  </div>
                </td>
                <td className="px-4 py-4 text-muted">{product.category}</td>
                <td className="px-4 py-4 font-semibold text-ink">
                  {formatPrice(product.sizes?.[0]?.price)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      Number(product.stock) > 0
                        ? "bg-primary-light text-primary-dark"
                        : "bg-danger/15 text-danger"
                    }`}
                  >
                    {Number(product.stock) > 0
                      ? `${product.stock} un.`
                      : "Esgotado"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => toggleActive(product)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      product.ativo !== false
                        ? "bg-success/15 text-success hover:bg-success/25"
                        : "bg-danger/15 text-danger hover:bg-danger/25"
                    }`}
                  >
                    {product.ativo !== false ? "Publicado" : "Oculto"}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        editingId === product.id ? cancelEditing() : startEditing(product)
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-2 text-xs font-semibold text-primary-dark hover:bg-line"
                    >
                      {editingId === product.id ? (
                        <>
                          <X className="h-4 w-4" /> Cancelar
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-4 w-4" /> Editar
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(product)}
                      aria-label={`Excluir ${product.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-brand-sm border border-[#f0d3ce] text-danger transition hover:bg-[#fdecea]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visibleProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-12 text-center text-muted">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingId && draft && (
        <div className="rounded-brand border border-primary-light bg-surface p-5 shadow-brand-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="m-0 font-display text-lg text-primary-dark">
                Editar produto
              </h3>
              <p className="m-0 mt-1 text-xs text-muted">
                Os campos abaixo são enviados para PUT /api/products/
                {"{id}"}.
              </p>
            </div>
            <button
              type="button"
              onClick={cancelEditing}
              aria-label="Fechar edição"
              className="rounded-full bg-primary-light p-2 text-primary-dark hover:bg-line"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Nome
              <input
                className={inputClass}
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              />
            </label>
            <label className={labelClass}>
              Preço (R$)
              <input
                type="number"
                min="0.01"
                step="0.01"
                className={inputClass}
                value={draft.price}
                onChange={(event) => setDraft({ ...draft, price: event.target.value })}
              />
            </label>
            <label className={labelClass}>
              Categoria
              <select
                className={inputClass}
                value={draft.categoria}
                onChange={(event) => setDraft({ ...draft, categoria: event.target.value })}
              >
                {CATEGORIAS.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Estoque
              <input
                type="number"
                min="0"
                step="1"
                className={inputClass}
                value={draft.quantidade}
                onChange={(event) => setDraft({ ...draft, quantidade: event.target.value })}
              />
            </label>
            <label className={labelClass}>
              Estoque mínimo
              <input
                type="number"
                min="0"
                step="1"
                className={inputClass}
                value={draft.quantidadeMinima}
                onChange={(event) =>
                  setDraft({ ...draft, quantidadeMinima: event.target.value })
                }
              />
            </label>
            <label className={labelClass}>
              Imagem (nome do arquivo ou URL)
              <input
                className={inputClass}
                placeholder="abc123.jpg"
                value={draft.imagem}
                onChange={(event) => setDraft({ ...draft, imagem: event.target.value })}
              />
            </label>
            <label className={labelClass}>
              Data de fabricação
              <input
                type="date"
                className={inputClass}
                value={draft.dataFabricacao}
                onChange={(event) =>
                  setDraft({ ...draft, dataFabricacao: event.target.value })
                }
              />
            </label>
            <label className={labelClass}>
              Validade
              <input
                type="date"
                className={inputClass}
                value={draft.validade}
                onChange={(event) => setDraft({ ...draft, validade: event.target.value })}
              />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Link da FISPQ
              <input
                type="url"
                className={inputClass}
                placeholder="https://..."
                value={draft.fispq}
                onChange={(event) => setDraft({ ...draft, fispq: event.target.value })}
              />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Descrição
              <textarea
                rows="3"
                className={`${inputClass} resize-y`}
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
              />
            </label>
            <label className="flex items-center gap-2 self-end text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={draft.ativo}
                onChange={(event) => setDraft({ ...draft, ativo: event.target.checked })}
              />
              Produto publicado
            </label>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={saveProduct}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check className="h-4 w-4" />
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="rounded-full border border-line bg-transparent px-5 py-2.5 text-sm font-semibold text-primary-dark hover:bg-primary-light"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b2822]/45 p-5 backdrop-blur-[2px]"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirmar exclusão"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-brand bg-surface p-6 text-center shadow-brand-md"
          >
            <h3 className="m-0 font-display text-lg text-primary-dark">
              Excluir produto?
            </h3>
            <p className="mt-2 text-sm text-muted">
              <strong className="text-ink">{confirmDelete.name}</strong> será removido
              do catálogo.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-primary-dark hover:bg-primary-light"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => removeProduct(confirmDelete)}
                className="rounded-full bg-danger px-4 py-2 text-sm font-bold text-white hover:opacity-90"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
