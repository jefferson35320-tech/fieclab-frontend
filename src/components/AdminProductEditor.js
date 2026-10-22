import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

const inputClass =
  "w-full rounded-brand-sm border border-line bg-page px-3 py-2 font-body text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

const labelClass = "flex flex-col gap-1.5 text-xs font-semibold text-muted";

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePrice(value) {
  return Number(String(value).replace(",", "."));
}

function buildDraft(product) {
  return {
    name: product.name,
    category: product.category,
    icon: product.icon || "",
    image: product.image || "",
    stock: String(product.stock),
    sizes: product.sizes.map((size) => ({
      id: size.id,
      label: size.label,
      price: String(size.price).replace(".", ","),
      isNew: false,
    })),
    aromas: [...product.aromas],
    howToUse: product.howToUse || "",
    storage: product.storage || "",
    precautions: product.precautions || "",
    ingredients: product.ingredients || "",
  };
}

function AdminProductEditor({ product, categories, onSave, onSaveStock }) {
  const [draft, setDraft] = useState(() => buildDraft(product));
  const [aromaInput, setAromaInput] = useState("");
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const saving = status.type === "saving";
  const categoryOptions = categories.includes(draft.category)
    ? categories
    : [...categories, draft.category];

  function setField(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setStatus({ type: "idle", message: "" });
  }

  function updateSize(index, field, value) {
    setField(
      "sizes",
      draft.sizes.map((size, i) =>
        i === index ? { ...size, [field]: value } : size,
      ),
    );
  }

  function addSize() {
    setField("sizes", [
      ...draft.sizes,
      { id: "", label: "", price: "", isNew: true },
    ]);
  }

  function removeSize(index) {
    setField(
      "sizes",
      draft.sizes.filter((_, i) => i !== index),
    );
  }

  function addAroma() {
    const aroma = aromaInput.trim();
    if (!aroma) return;
    if (!draft.aromas.some((a) => a.toLowerCase() === aroma.toLowerCase())) {
      setField("aromas", [...draft.aromas, aroma]);
    }
    setAromaInput("");
  }

  function removeAroma(aroma) {
    setField(
      "aromas",
      draft.aromas.filter((a) => a !== aroma),
    );
  }

  function validate() {
    const found = [];
    if (!draft.name.trim()) found.push("Informe o nome do produto.");
    if (!draft.category.trim()) found.push("Informe a categoria.");

    const stock = Number(draft.stock);
    if (draft.stock === "" || !Number.isInteger(stock)) {
      found.push("O estoque deve ser um número inteiro.");
    }

    if (draft.sizes.length === 0) {
      found.push("O produto precisa de pelo menos um tamanho.");
    }
    draft.sizes.forEach((size, i) => {
      const price = parsePrice(size.price);
      if (!size.label.trim()) found.push(`Tamanho ${i + 1}: informe o nome.`);
      if (size.price === "" || Number.isNaN(price) || price <= 0) {
        found.push(`Tamanho ${i + 1}: informe um preço válido.`);
      }
    });

    return found;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const found = validate();
    setErrors(found);
    if (found.length > 0) return;

    // gera ids para tamanhos novos (os existentes mantêm o id original,
    // pois ele é usado nas imagens por variação e nos itens do carrinho)
    const usedIds = new Set(
      draft.sizes.filter((s) => !s.isNew).map((s) => s.id),
    );
    const sizes = draft.sizes.map((size) => {
      let id = size.id;
      if (size.isNew) {
        const base = slugify(size.label) || "tamanho";
        id = base;
        let n = 2;
        while (usedIds.has(id)) id = `${base}-${n++}`;
        usedIds.add(id);
      }
      return { id, label: size.label.trim(), price: parsePrice(size.price) };
    });

    // campos que vivem só no front (por enquanto)
    onSave({
      name: draft.name.trim(),
      category: draft.category.trim(),
      icon: draft.icon.trim(),
      image: draft.image.trim(),
      sizes,
      aromas: draft.aromas,
      howToUse: draft.howToUse.trim(),
      storage: draft.storage.trim(),
      precautions: draft.precautions.trim(),
      ingredients: draft.ingredients.trim(),
    });

    // estoque: passa pelo serviço (ponto de integração com o backend)
    const newStock = Number(draft.stock);
    if (newStock !== product.stock) {
      setStatus({ type: "saving", message: "Salvando estoque..." });
      try {
        await onSaveStock(newStock);
        setStatus({ type: "success", message: "Alterações salvas." });
      } catch (err) {
        setStatus({
          type: "error",
          message:
            "Os dados foram salvos, mas não foi possível atualizar o estoque. Tente novamente.",
        });
      }
    } else {
      setStatus({ type: "success", message: "Alterações salvas." });
    }
  }

  function handleReset() {
    setDraft(buildDraft(product));
    setAromaInput("");
    setErrors([]);
    setStatus({ type: "idle", message: "" });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border-t border-line bg-page/60 px-4 pb-5 pt-4"
    >
      <div
        className={`flex items-center justify-between rounded-brand-sm border px-4 py-3 ${
          product.stock > 0
            ? "border-line bg-surface"
            : "border-danger/40 bg-danger/10"
        }`}
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          Estoque atual
        </span>
        <strong
          className={`font-display text-xl ${
            product.stock > 0 ? "text-primary-dark" : "text-danger"
          }`}
        >
          {product.stock}{" "}
          {Math.abs(product.stock) === 1 ? "unidade" : "unidades"}
          {product.stock <= 0 && (
            <span className="ml-2 text-xs font-bold uppercase tracking-wide">
              · esgotado
            </span>
          )}
        </strong>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          Nome
          <input
            className={inputClass}
            value={draft.name}
            onChange={(e) => setField("name", e.target.value)}
          />
        </label>

        <label className={labelClass}>
          Categoria
          <select
            className={inputClass}
            value={draft.category}
            onChange={(e) => setField("category", e.target.value)}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Ícone (emoji)
          <input
            className={inputClass}
            value={draft.icon}
            onChange={(e) => setField("icon", e.target.value)}
          />
        </label>

        <label className={labelClass}>
          Imagem (caminho)
          <input
            className={inputClass}
            value={draft.image}
            onChange={(e) => setField("image", e.target.value)}
            placeholder="/images/products/produto.jpg"
          />
        </label>
      </div>

      {/* Estoque: único campo integrado ao serviço de backend */}
      <div className="rounded-brand-sm border border-line bg-surface p-3">
        <label className={labelClass}>
          Estoque (unidades)
          <input
            type="number"
            min="0"
            step="1"
            className={`${inputClass} sm:max-w-[160px]`}
            value={draft.stock}
            onChange={(e) => setField("stock", e.target.value)}
          />
        </label>
        <p className="m-0 mt-2 text-xs text-muted">
          Atualizado pelo serviço de estoque (backend). Estoque 0 ou negativo
          marca o produto como esgotado.
        </p>
      </div>

      {/* Tamanhos */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-muted">
          Tamanhos e preços
        </span>
        {draft.sizes.map((size, index) => (
          <div key={size.id || `new-${index}`} className="flex items-end gap-2">
            <label className={`${labelClass} flex-1`}>
              <span className="sr-only">Nome do tamanho</span>
              <input
                className={inputClass}
                placeholder="Ex.: 500ml"
                value={size.label}
                onChange={(e) => updateSize(index, "label", e.target.value)}
              />
            </label>
            <label className={`${labelClass} w-28`}>
              <span className="sr-only">Preço</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                  R$
                </span>
                <input
                  inputMode="decimal"
                  className={`${inputClass} pl-9`}
                  placeholder="0,00"
                  value={size.price}
                  onChange={(e) => updateSize(index, "price", e.target.value)}
                />
              </div>
            </label>
            <button
              type="button"
              onClick={() => removeSize(index)}
              aria-label="Remover tamanho"
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-brand-sm border border-[#f0d3ce] bg-transparent text-danger transition hover:bg-[#fdecea]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSize}
          className="flex w-fit items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 font-body text-[13px] font-semibold text-primary-dark transition hover:bg-line"
        >
          <Plus className="h-4 w-4" /> Adicionar tamanho
        </button>
      </div>

      {/* Aromas */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-muted">Aromas</span>
        {draft.aromas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {draft.aromas.map((aroma) => (
              <span
                key={aroma}
                className="flex items-center gap-1.5 rounded-full bg-primary-light py-1 pl-3 pr-1.5 text-[13px] font-semibold text-primary-dark"
              >
                {aroma}
                <button
                  type="button"
                  onClick={() => removeAroma(aroma)}
                  aria-label={`Remover aroma ${aroma}`}
                  className="flex h-5 w-5 items-center justify-center rounded-full border-none bg-transparent p-0 text-primary-dark transition hover:bg-line"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Novo aroma"
            value={aromaInput}
            onChange={(e) => setAromaInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAroma();
              }
            }}
          />
          <button
            type="button"
            onClick={addAroma}
            className="shrink-0 rounded-full bg-primary-light px-4 font-body text-[13px] font-semibold text-primary-dark transition hover:bg-line"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Textos informativos */}
      {[
        ["howToUse", "Modo de usar"],
        ["storage", "Armazenamento"],
        ["precautions", "Precauções"],
        ["ingredients", "Ingredientes"],
      ].map(([field, label]) => (
        <label key={field} className={labelClass}>
          {label}
          <textarea
            rows={3}
            className={`${inputClass} resize-y`}
            value={draft[field]}
            onChange={(e) => setField(field, e.target.value)}
          />
        </label>
      ))}

      <p className="m-0 text-xs text-muted">
        Avaliação: ★ {product.rating.toFixed(1)} ({product.ratingCount}{" "}
        avaliações) — gerada pelos clientes, não editável.
      </p>

      {errors.length > 0 && (
        <ul
          role="alert"
          className="m-0 list-disc pl-5 text-[13px] font-semibold text-danger"
        >
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {status.message && (
        <p
          role="status"
          className={`m-0 text-[13px] font-semibold ${
            status.type === "error" ? "text-danger" : "text-success"
          }`}
        >
          {status.message}
        </p>
      )}

      <div className="flex gap-2.5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full border-none bg-primary px-5 py-[10px] font-body text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="rounded-full border border-line bg-transparent px-5 py-[10px] font-body text-sm font-semibold text-primary-dark transition hover:bg-primary-light disabled:opacity-60"
        >
          Desfazer
        </button>
      </div>
    </form>
  );
}

export default AdminProductEditor;
