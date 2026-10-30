// ---------------------------------------------------------------------------
// Serviço de ESTOQUE
//
// Este é o ÚNICO ponto do sistema preparado para integração com o backend.
// Por enquanto tudo é simulado em memória (o "banco" abaixo some ao recarregar
// a página). Para integrar, basta trocar o corpo das duas funções exportadas
// pelas chamadas reais à API — o restante do site não precisa mudar.
// ---------------------------------------------------------------------------

// const API_URL = process.env.REACT_APP_API_URL;

const SIMULATED_LATENCY_MS = 400;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// "banco de dados" simulado: { [productId]: quantidade }
let fakeDatabase = null;

// Busca o estoque atual de todos os produtos.
// Retorno esperado: { [productId]: number }
export async function fetchStock(seedProducts) {
  // TODO(backend): substituir por
  //   const res = await fetch(`${API_URL}/stock`, { headers: authHeaders });
  //   if (!res.ok) throw new Error("Falha ao buscar estoque");
  //   return res.json();
  await wait(SIMULATED_LATENCY_MS);

  if (!fakeDatabase) {
    fakeDatabase = Object.fromEntries(
      seedProducts.map((product) => [product.id, product.stock])
    );
  }
  return { ...fakeDatabase };
}

// Atualiza o estoque de UM produto.
// Deve lançar um erro se o backend recusar (o painel mostra a mensagem).
export async function updateStock(productId, stock) {
  // TODO(backend): substituir por
  //   const res = await fetch(`${API_URL}/products/${productId}/stock`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json", ...authHeaders },
  //     body: JSON.stringify({ stock }),
  //   });
  //   if (!res.ok) throw new Error("Falha ao atualizar estoque");
  //   return res.json();
  //
  // IMPORTANTE: o backend deve validar o token do Firebase (ID token) e
  // conferir se o usuário é admin — esconder o botão no front não é segurança.
  await wait(SIMULATED_LATENCY_MS);

  if (!fakeDatabase) fakeDatabase = {};
  fakeDatabase[productId] = stock;
  return { productId, stock };
}
