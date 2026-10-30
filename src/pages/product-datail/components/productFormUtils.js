export const PRODUCT_TYPES = [
  { value: "CABELO", label: "Cabelo" },
  { value: "PELE", label: "Pele" },
  { value: "PERFUME", label: "Perfume" },
];

// produto do backend -> valores dos campos do formulário (inputs trabalham com texto)
export function toForm(product) {
  return {
    name: product.name ?? "",
    price: product.price ?? "",
    description: product.description ?? "",
    imageUrl: product.imageUrl ?? "",
    type: product.type ?? "",
    batch: product.batch ?? "",
    mfgDate: product.mfgDate ?? "",
    expDate: product.expDate ?? "",
    supplierId: product.supplierId ?? "",
  };
}

// valores do formulário -> corpo que o backend espera (números e datas no formato certo)
export function toPayload(form) {
  const toNumber = (value) => (value === "" ? null : Number(value));

  return {
    name: form.name.trim(),
    price: toNumber(form.price),
    description: form.description.trim() || null,
    imageUrl: form.imageUrl.trim() || null,
    type: form.type,
    batch: toNumber(form.batch),
    mfgDate: form.mfgDate || null, // "yyyy-MM-dd"
    expDate: form.expDate || null,
    supplierId: toNumber(form.supplierId),
  };
}

// devolve um objeto { campo: "mensagem" } com os erros (vazio = tudo certo)
export function validate(form) {
  const errors = {};

  if (!form.name.trim()) errors.name = "Informe o nome do produto.";
  if (form.price === "" || Number(form.price) < 0) {
    errors.price = "Informe um preço válido (0 ou mais).";
  }
  if (!form.type) errors.type = "Escolha o tipo do produto.";
  if (form.batch !== "" && Number(form.batch) < 0) {
    errors.batch = "O lote não pode ser negativo.";
  }
  if (form.mfgDate && form.expDate && form.expDate < form.mfgDate) {
    errors.expDate = "A validade não pode ser antes da fabricação.";
  }

  return errors;
}
