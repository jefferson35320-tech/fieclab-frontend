import api from "../config/api";

const LOCAL_ORDERS_KEY = "fieclab_orders";
const LOCAL_STATUSES_KEY = "fieclab_orders_status";

export const ORDER_STATUSES = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "CONFIRMADO", label: "Confirmado" },
  { value: "EM_PREPARACAO", label: "Em preparação" },
  { value: "ENVIADO", label: "Enviado" },
  { value: "CONCLUIDO", label: "Concluído" },
  { value: "CANCELADO", label: "Cancelado" },
];

function readLocal(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocal(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sem localStorage (modo privado/ERRO): mantém apenas em memória.
  }
}

export function extractList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.orders)) return data.orders;
  return [];
}

function normalizeOrder(order, index) {
  const items = Array.isArray(order.items) ? order.items : [];
  return {
    id: order.id || order.orderCode || `local-${index}`,
    orderCode: order.orderCode || order.codigo || `#${index + 1}`,
    customerName:
      order.customerName ||
      order.customer?.name ||
      order.user?.name ||
      "Cliente não identificado",
    customerEmail:
      order.customerEmail ||
      order.customer?.email ||
      order.user?.email ||
      order.email ||
      "",
    customerPhone: order.customerPhone || order.customer?.phone || order.phone || "",
    items: items.map((item) => ({
      name: item.name || item.productName || "Produto",
      quantity: Number(item.quantity || 1),
      unitPrice: Number(item.unitPrice ?? item.price ?? 0),
      size: item.size || "",
      scent: item.scent || item.aroma || "",
    })),
    total: Number(order.total ?? 0),
    status: order.status || "PENDENTE",
    createdAt: order.createdAt || order.created_at || null,
  };
}

function localOrders() {
  const stored = readLocal(LOCAL_ORDERS_KEY);
  if (!Array.isArray(stored)) return [];

  const statusOverrides = readLocal(LOCAL_STATUSES_KEY) || {};

  return stored
    .map((order, index) => {
      const normalized = normalizeOrder(order, index);
      return {
        ...normalized,
        status: statusOverrides[normalized.id] || normalized.status,
      };
    })
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

// Enquanto o backend não expõe /api/orders, o painel lê os pedidos salvos pelo
// checkout. Quando a rota existir, a leitura passa a ser feita no banco.
export const orderService = {
  async findAll(params = { page: 0, size: 100, sort: "createdAt,desc" }) {
    try {
      const response = await api.get("/api/orders", { params, timeout: 8000 });
      return {
        source: "backend",
        orders: extractList(response.data).map(normalizeOrder),
      };
    } catch (error) {
      const status = error.response?.status;
      // 404/405 = rota ainda não implementada; 401/403 continua sendo erro real.
      if (status && status !== 404 && status !== 405) throw error;
      return { source: "local", orders: localOrders() };
    }
  },

  async updateStatus(order, nextStatus) {
    if (order.id && !String(order.id).startsWith("local-")) {
      try {
        const response = await api.patch(
          `/api/orders/${order.id}/status`,
          { status: nextStatus },
          { timeout: 8000 }
        );
        return normalizeOrder({ ...order, ...response.data });
      } catch (error) {
        const status = error.response?.status;
        if (status !== 404 && status !== 405) throw error;
      }
    }

    const overrides = readLocal(LOCAL_STATUSES_KEY) || {};
    overrides[order.id] = nextStatus;
    writeLocal(LOCAL_STATUSES_KEY, overrides);
    return { ...order, status: nextStatus };
  },
};
