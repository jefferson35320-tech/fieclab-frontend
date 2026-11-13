import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productService } from '../../services/productService';
import { CATEGORIAS } from '../../data/productMapper';
import Logo from '../../components/Logo';
import ThemeToggle from '../../components/ThemeToggle';

// mesmo estilo dos campos do formulário de edição do produto
const INPUT_CLASS =
  'w-full rounded-brand-sm border border-line bg-surface px-4 py-3 font-body text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30';

function Field({ id, label, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

// monta a mensagem de erro a partir da resposta do backend
function describeError(error) {
  const res = error.response;
  if (!res) return 'Sem resposta do servidor (rede, CORS ou servidor fora do ar).';
  if (res.status === 401 || res.status === 403) {
    return `Erro ${res.status}: acesso negado. Faça login (token JWT) e tente de novo.`;
  }
  const data = res.data;
  const detail =
    (data && (data.message || data.error || data.detail)) ||
    (typeof data === 'string' ? data : '');
  return `Erro ${res.status}${detail ? ': ' + detail : ''}`;
}

export function CreateProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoria: CATEGORIAS[0].value,
    dataFabricacao: '',
    validade: '',
    fispq: '',
    quantidade: '0',
    quantidadeMinima: '0',
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    // corpo no formato do ProductDTO do backend
    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim() || null,
      ativo: true,
      dataFabricacao: formData.dataFabricacao || null, // "yyyy-MM-dd"
      validade: formData.validade || null,
      fispq: formData.fispq.trim() || null, // precisa ser uma URL válida
      categoria: formData.categoria,
      estoque: {
        quantidade: Number(formData.quantidade) || 0,
        quantidadeMinima: Number(formData.quantidadeMinima) || 0,
      },
    };

    let created;
    try {
      // 1) cria o produto: POST /api/products
      created = await productService.create(payload);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      setErrorMsg(describeError(error));
      setSaving(false);
      return;
    }

    // 2) envia a foto: POST /api/products/{id}/image (multipart)
    if (imageFile) {
      try {
        await productService.uploadImage(created.id, imageFile);
      } catch (error) {
        console.error('Erro ao enviar a imagem:', error);
        window.alert(
          `Produto criado, mas a imagem não foi enviada (${describeError(error)}).`
        );
      }
    }

    setSaving(false);
    navigate('/home'); // o catálogo busca a lista atualizada no banco
  };

  return (
    <div className="min-h-screen px-5 py-10">
      <div className="mx-auto w-full max-w-[640px]">
        <button
          type="button"
          className="mb-5 flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-body text-sm font-semibold text-primary-dark hover:underline"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao catálogo
        </button>

        <div className="rounded-brand border border-line bg-surface p-6 shadow-brand-md sm:p-8">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>

          <h1 className="m-0 mb-6 font-display text-2xl font-bold text-primary-dark sm:text-[28px]">
            Criar Produto
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="name" label="Nome:" className="sm:col-span-2">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={INPUT_CLASS}
              />
            </Field>

            <Field id="price" label="Preço (R$):">
              <input
                type="number"
                step="0.01"
                min="0.01"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className={INPUT_CLASS}
              />
            </Field>

            <Field id="categoria" label="Categoria:">
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
                className={INPUT_CLASS}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="description" label="Descrição:" className="sm:col-span-2">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={INPUT_CLASS}
              />
            </Field>

            <Field id="quantidade" label="Quantidade em estoque:">
              <input
                type="number"
                min="0"
                id="quantidade"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleInputChange}
                required
                className={INPUT_CLASS}
              />
            </Field>

            <Field id="quantidadeMinima" label="Estoque mínimo:">
              <input
                type="number"
                min="0"
                id="quantidadeMinima"
                name="quantidadeMinima"
                value={formData.quantidadeMinima}
                onChange={handleInputChange}
                required
                className={INPUT_CLASS}
              />
            </Field>

            <Field id="dataFabricacao" label="Data de Fabricação:">
              <input
                type="date"
                id="dataFabricacao"
                name="dataFabricacao"
                value={formData.dataFabricacao}
                onChange={handleInputChange}
                className={INPUT_CLASS}
              />
            </Field>

            <Field id="validade" label="Data de Validade:">
              <input
                type="date"
                id="validade"
                name="validade"
                value={formData.validade}
                onChange={handleInputChange}
                className={INPUT_CLASS}
              />
            </Field>

            <Field id="fispq" label="Link da FISPQ (opcional):" className="sm:col-span-2">
              <input
                type="url"
                id="fispq"
                name="fispq"
                value={formData.fispq}
                onChange={handleInputChange}
                placeholder="https://..."
                className={INPUT_CLASS}
              />
            </Field>

            <Field id="imagem" label="Imagem do Produto:" className="sm:col-span-2">
              <input
                type="file"
                id="imagem"
                accept="image/*"
                onChange={handleImageChange}
                className={`${INPUT_CLASS} cursor-pointer file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-light file:px-4 file:py-2 file:font-body file:text-[13px] file:font-semibold file:text-primary-dark`}
              />

              {imagePreview && (
                <div className="mt-3">
                  <p className="m-0 mb-1.5 text-[13px] text-muted">Pré-visualização:</p>
                  <img
                    src={imagePreview}
                    alt="Preview do produto"
                    className="h-[150px] w-[150px] rounded-brand-sm border border-line object-cover"
                  />
                </div>
              )}
            </Field>

            {errorMsg && (
              <p className="m-0 text-sm text-danger sm:col-span-2" role="alert">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full cursor-pointer rounded-full border-0 bg-primary px-5 py-3 font-body text-[15px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
            >
              {saving ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </form>
        </div>
      </div>

      <ThemeToggle />
    </div>
  );
}
