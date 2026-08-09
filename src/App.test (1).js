// Simulação simples de "banco de dados" de pedidos usando localStorage.
// Em um projeto real, isso seria substituído por uma chamada de API para o backend.

const STORAGE_KEY = "fieclab_orders";

function generateOrderCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FL-${code}`;
}

function readOrders() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Não foi possível ler os pedidos salvos:", err);
    return [];
  }
}

function saveOrders(orders) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Não foi possível salvar o pedido:", err);
  }
}

// Cria um novo pedido, gera um código único e persiste no "banco de dados".
export function createOrder(cart, total) {
  const orders = readOrders();

  let orderCode;
  do {
    orderCode = generateOrderCode();
  } while (orders.some((o) => o.orderCode === orderCode));

  const order = {
    orderCode,
    items: cart,
    total,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  saveOrders(orders);

  return order;
}

export function getOrders() {
  return readOrders();
}
