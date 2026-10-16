import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Save, Trash2, X } from "lucide-react";

import ThemeToggle from "../../components/ThemeToggle";
import Modal from "../../shared/components/Modal";
import { productService } from "../../services/productService";
import ProductForm from "./components/ProductForm";
import { PRODUCT_TYPES, toForm, toPayload, validate } from "./components/productFormUtils";

const PRIMARY_BUTTON =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-primary px-6 py-2.5 font-body text-[14px] font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60";
const OUTLINE_BUTTON =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-6 py-2.5 font-body text-[14px] font-semibold text-primary-dark transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60";
const DANGER_BUTTON =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-danger bg-transparent px-6 py-2.5 font-body text-[14px] font-semibold text-danger transition hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

function ProductDetailPage() {
  // o :id vem da URL (rota /products/:id)
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // busca o produto no backend sempre que o id da URL mudar
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    productService
      .getProductById(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setForm(toForm(data));
        setStatus("ready");
      })
      .catch(() => {
        // a animação de erro já é mostrada pelo interceptor
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleChange(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function handleCancel() {
    setForm(toForm(product));
    setErrors({});
    setEditing(false);
  }

  async function handleSave(event) {
    event.preventDefault();

    const foundErrors = validate(form);
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }

    setSaving(true);
    try {
      const updated = await productService.updateProduct(id, {
        ...toPayload(form),
        id,
      });
      setProduct(updated);
      setForm(toForm(updated));
      setEditing(false);
    } catch {
      // o interceptor já mostrou o erro; continua no modo edição para corrigir
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await productService.deleteProduct(id);
      navigate("/");
    } catch {
      /* erro já mostrado pelo interceptor */
    } finally {
      setConfirmDelete(false);
    }
  }

  const typeLabel = PRODUCT_TYPES.find((type) => type.value === product?.type)?.label;

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-10">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 font-body text-[14px] font-semibold text-primary-dark no-underline hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para a loja
        </Link>

        {status === "loading" && (
          <p className="py-10 text-center text-sm text-muted">Carregando produto...</p>
        )}

        {status === "error" && (
          <p className="py-10 text-center text-sm text-muted">
            Não foi possível carregar este produto. Confira o link e tente de novo.
          </p>
        )}

        {status === "ready" && (
          <>
            <div className="mb-6">
              <h1 className="m-0 font-display text-2xl font-bold text-primary-dark sm:text-[32px]">
                {product.name}
              </h1>
              <p className="m-0 mt-1.5 text-[13px] text-muted">
                {typeLabel && <span className="font-semibold">{typeLabel} · </span>}
                Código: {product.id}
              </p>
            </div>

            <div className="rounded-brand border border-line bg-surface p-5 shadow-brand-sm sm:p-7">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="mb-6 h-48 w-full rounded-brand object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}

              <ProductForm
                values={form}
                errors={errors}
                readOnly={!editing}
                onChange={handleChange}
                onSubmit={handleSave}
              >
                {editing ? (
                  <>
                    <button type="button" className={OUTLINE_BUTTON} onClick={handleCancel} disabled={saving}>
                      <X className="h-4 w-4" aria-hidden="true" />
                      Cancelar
                    </button>
                    <button type="submit" className={PRIMARY_BUTTON} disabled={saving}>
                      <Save className="h-4 w-4" aria-hidden="true" />
                      {saving ? "Salvando..." : "Salvar alterações"}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className={DANGER_BUTTON} onClick={() => setConfirmDelete(true)}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Excluir
                    </button>
                    <button type="button" className={PRIMARY_BUTTON} onClick={() => setEditing(true)}>
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Editar
                    </button>
                  </>
                )}
              </ProductForm>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={confirmDelete}
        title="Excluir produto?"
        onClose={() => setConfirmDelete(false)}
        footer={
          <>
            <button type="button" className={OUTLINE_BUTTON} onClick={() => setConfirmDelete(false)}>
              Cancelar
            </button>
            <button type="button" className={DANGER_BUTTON} onClick={handleDelete}>
              Sim, excluir
            </button>
          </>
        }
      >
        <p className="m-0">
          Você vai excluir <strong>{product?.name}</strong>. Essa ação não pode ser desfeita.
        </p>
      </Modal>

      <ThemeToggle />
    </div>
  );
}

export default ProductDetailPage;
