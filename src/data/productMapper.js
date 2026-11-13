import api from "../config/api";

// Converte o produto que vem do backend (ProductDTO) para o formato que as
// telas (card, modal, carrinho, painel admin) já usam.
//
// ProductDTO: { id, name, price, description, ativo, dataFabricacao, validade,
//               fispq, imagem, categoria, estoque: { quantidade, quantidadeMinima } }
//
// O banco ainda NÃO tem: avaliação, tamanhos, aromas e modo de uso. Para esses
// campos usamos valores padrão, assim a tela não quebra.

// valores do enum Categoria do backend -> texto mostrado na loja
export const CATEGORIAS = [
  { value: "REAGENTE", label: "Reagente", icon: "🧪" },
  { value: "VIDRARIA", label: "Vidraria", icon: "⚗️" },
  { value: "EQUIPAMENTO", label: "Equipamento", icon: "🔬" },
  { value: "EPI", label: "EPI", icon: "🥽" },
  { value: "OUTROS", label: "Outros", icon: "📦" },
];

export function typeLabel(categoria) {
  const found = CATEGORIAS.find((c) => c.value === categoria);
  return found ? found.label : categoria || "Outros";
}

// O backend guarda em "imagem" só o nome do arquivo (ex.: "abc123.jpg") ou uma
// URL completa. Se for só o nome, montamos o endereço em cima da URL da API.
// ATENÇÃO: o backend precisa SERVIR a pasta "uploads" nesse caminho.
export function imageSrc(imagem) {
  if (!imagem) return "";
  if (/^(https?:)?\/\//.test(imagem) || imagem.startsWith("data:")) return imagem;
  const base = String(api.defaults.baseURL || "").replace(/\/$/, "");
  return `${base}/uploads/${imagem}`;
}

export function mapApiProduct(p) {
  const price = Number(p.price) || 0;
  const hasStock = !!p.estoque && Number.isFinite(p.estoque.quantidade);
  const categoria = CATEGORIAS.find((c) => c.value === p.categoria);

  return {
    // --- vindos do banco ---
    id: p.id,
    name: p.name,
    description: p.description || "",
    ativo: p.ativo !== false,
    categoria: p.categoria,
    category: typeLabel(p.categoria),
    image: imageSrc(p.imagem),
    imagem: p.imagem || "",
    dataFabricacao: p.dataFabricacao,
    validade: p.validade,
    fispq: p.fispq || "",
    stock: hasStock ? p.estoque.quantidade : 0,
    stockMin: hasStock ? p.estoque.quantidadeMinima : 0,
    stockKnown: hasStock,

    // --- o produto vendável (preço único do banco) ---
    sizes: [{ id: "unidade", label: "Unidade", price }],

    // --- ainda não existem no banco: valores padrão ---
    icon: categoria ? categoria.icon : "📦",
    rating: 0,
    ratingCount: 0,
    aromas: [],
    variantImages: {},
    howToUse: "",
    storage: "",
    precautions: "",
    ingredients: "",
  };
}

// o Spring devolve uma página ({ content: [...] }); aceita lista simples também
export function extractList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  return [];
}
