import { PRODUCT_TYPES } from "./productFormUtils";

const INPUT_CLASS =
  "w-full rounded-brand-sm border border-line bg-surface px-4 py-3 font-body text-[15px] text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 read-only:cursor-default read-only:bg-primary-light/40 disabled:cursor-default disabled:bg-primary-light/40 disabled:opacity-100";

function Field({ id, label, error, className = "", children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="m-0 mt-1 text-[12px] font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

// formulário do produto; readOnly = só mostrando, sem editar
// os botões (Salvar, Cancelar...) chegam como children
function ProductForm({ values, errors = {}, readOnly = false, onChange, onSubmit, children }) {
  function bind(field) {
    return {
      id: `product-${field}`,
      value: values[field],
      readOnly,
      onChange: (event) => onChange(field, event.target.value),
    };
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field id="product-name" label="Nome" error={errors.name} className="sm:col-span-2">
        <input type="text" className={INPUT_CLASS} {...bind("name")} />
      </Field>

      <Field id="product-price" label="Preço (R$)" error={errors.price}>
        <input type="number" min="0" step="0.01" className={INPUT_CLASS} {...bind("price")} />
      </Field>

      <Field id="product-type" label="Tipo" error={errors.type}>
        <select
          className={INPUT_CLASS}
          id="product-type"
          value={values.type}
          disabled={readOnly}
          onChange={(event) => onChange("type", event.target.value)}
        >
          <option value="">Selecione...</option>
          {PRODUCT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="product-description" label="Descrição" error={errors.description} className="sm:col-span-2">
        <textarea rows={3} className={INPUT_CLASS} {...bind("description")} />
      </Field>

      <Field id="product-imageUrl" label="Link da imagem" error={errors.imageUrl} className="sm:col-span-2">
        <input type="url" className={INPUT_CLASS} {...bind("imageUrl")} />
      </Field>

      <Field id="product-batch" label="Lote" error={errors.batch}>
        <input type="number" min="0" step="1" className={INPUT_CLASS} {...bind("batch")} />
      </Field>

      <Field id="product-supplierId" label="Fornecedor (código)" error={errors.supplierId}>
        <input type="number" min="0" step="1" className={INPUT_CLASS} {...bind("supplierId")} />
      </Field>

      <Field id="product-mfgDate" label="Fabricação" error={errors.mfgDate}>
        <input type="date" className={INPUT_CLASS} {...bind("mfgDate")} />
      </Field>

      <Field id="product-expDate" label="Validade" error={errors.expDate}>
        <input type="date" className={INPUT_CLASS} {...bind("expDate")} />
      </Field>

      {children && (
        <div className="mt-2 flex flex-wrap justify-end gap-3 sm:col-span-2">{children}</div>
      )}
    </form>
  );
}

export default ProductForm;
