import { useEffect, useMemo, useState } from "react";
import { Eye, RefreshCw, Server, HardDrive } from "lucide-react";

import { ORDER_STATUSES, orderService } from "../../services/order-service";

const selectClass =
  "w-full rounded-full border border-line bg-page px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

function formatPrice(value) {
  return `R$ ${Number(value || 0)
    .toFixed(2)
    .replace(".", ",")}`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function statusLabel(value) {
  return ORDER_STATUSES.find((status) => status.value === value)?.label || value;
}

function statusClass(value) {
  if (value === "CONCLUIDO") return "bg-success/15 text-success";
  if (value === "CANCELADO") return "bg-danger/15 text-danger";
  if (value === "ENVIADO") return "bg-primary-light text-primary-dark";
  return "bg-warning/15 text-warning";
}

export default function AdminOrdersView() {
  const [orders, setOrders] = useState([]);
  const [source, setSource] = useState("backend");
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("TODOS");
  const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadOrders() {
    setState("loading");
    setError("");
    try {
      const result = await orderService.findAll();
      setOrders(result.orders);
      setSource(result.source);
      setState("ready");
    } catch (err) {
      const status = err.response?.status;
      setError(
        status === 401 || status === 403
          ? "Entre com uma conta de administrador para visualizar os pedidos."
          : "Não foi possível conectar ao servidor de pedidos."
      );
      setState("error");
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(order, nextStatus) {
    setUpdatingId(order.id);
    try {
      const updated = await orderService.updateStatus(order, nextStatus);
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? { ...item, ...updated } : item))
      );
    } catch {
      setError("Não foi possível atualizar o status do pedido.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders = useMemo(() => {
    const term = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus =
        filterStatus === "TODOS" || order.status === filterStatus;
      const matchesTerm =
        !term ||
        `${order.orderCode} ${order.customerName} ${order.customerEmail}`
          .toLowerCase()
          .includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [orders, filterStatus, query]);

  const summary = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.status === "PENDENTE").length,
      revenue: orders
        .filter((order) => order.status !== "CANCELADO")
        .reduce((sum, order) => sum + Number(order.total || 0), 0),
    }),
    [orders]
  );

  return (
    <section className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-brand border border-line bg-surface p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Pedidos
          </span>
          <strong className="mt-1 block font-display text-2xl text-primary-dark">
            {summary.total}
          </strong>
        </div>
        <div className="rounded-brand border border-line bg-surface p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Aguardando
          </span>
          <strong className="mt-1 block font-display text-2xl text-warning">
            {summary.pending}
          </strong>
        </div>
        <div className="rounded-brand border border-line bg-surface p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Faturamento
          </span>
          <strong className="mt-1 block font-display text-2xl text-ink">
            {formatPrice(summary.revenue)}
          </strong>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por código ou cliente"
          className={`${selectClass} sm:max-w-80`}
        />
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className={selectClass}
          >
            <option value="TODOS">Todos os status</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={loadOrders}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-light px-4 py-2.5 text-sm font-semibold text-primary-dark transition hover:bg-line"
          >
            <RefreshCw className="h-4 w-4" /> Atualizar
          </button>
        </div>
      </div>

      {state === "loading" && (
        <p className="py-12 text-center text-sm text-muted">Carregando pedidos...</p>
      )}

      {state === "error" && (
        <div className="rounded-brand border border-danger/30 bg-danger/10 p-8 text-center">
          <p className="m-0 text-sm font-semibold text-danger">{error}</p>
          <button
            type="button"
            onClick={loadOrders}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {state === "ready" && (
        <>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            {source === "backend" ? (
              <>
                <Server className="h-4 w-4 text-success" />
                Pedidos carregados do banco de dados
              </>
            ) : (
              <>
                <HardDrive className="h-4 w-4 text-warning" />
                Pedidos locais: a rota /api/orders ainda não está disponível no backend
              </>
            )}
          </div>

          <div className="overflow-x-auto rounded-brand border border-line bg-surface">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="bg-page text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Pedido</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Itens</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-line align-middle">
                    <td className="px-4 py-4 font-bold text-primary-dark">
                      {order.orderCode}
                    </td>
                    <td className="px-4 py-4">
                      <span className="block text-ink">{order.customerName}</span>
                      {order.customerEmail && (
                        <span className="block text-xs text-muted">
                          {order.customerEmail}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-ink">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-4 text-muted">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(event) =>
                          handleStatusChange(order, event.target.value)
                        }
                        className={`${selectClass} w-auto text-xs font-semibold`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-2 text-xs font-semibold text-primary-dark hover:bg-line"
                      >
                        <Eye className="h-4 w-4" /> Ver
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-muted">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b2822]/45 p-5 backdrop-blur-[2px]"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes do pedido ${selectedOrder.orderCode}`}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-brand bg-surface p-6 shadow-brand-md"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="m-0 font-display text-xl text-primary-dark">
                  Pedido {selectedOrder.orderCode}
                </h3>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                    selectedOrder.status
                  )}`}
                >
                  {statusLabel(selectedOrder.status)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Fechar detalhes"
                className="rounded-full bg-primary-light px-3 py-2 text-sm font-semibold text-primary-dark hover:bg-line"
              >
                Fechar
              </button>
            </div>

            <div className="mb-5 rounded-brand-sm border border-line bg-page p-4 text-sm">
              <p className="m-0 text-ink">{selectedOrder.customerName}</p>
              {selectedOrder.customerEmail && (
                <p className="m-0 mt-1 text-muted">{selectedOrder.customerEmail}</p>
              )}
              {selectedOrder.customerPhone && (
                <p className="m-0 mt-1 text-muted">{selectedOrder.customerPhone}</p>
              )}
              <p className="m-0 mt-1 text-muted">{formatDate(selectedOrder.createdAt)}</p>
            </div>

            <h4 className="mb-3 font-display text-base text-ink">Itens</h4>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {selectedOrder.items.map((item, index) => (
                <li key={`${item.name}-${index}`} className="border-b border-line pb-3 last:border-0">
                  <div className="flex justify-between gap-3 text-sm">
                    <strong className="text-ink">{item.name}</strong>
                    <span className="shrink-0 font-semibold text-ink">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                  <p className="m-0 mt-1 text-xs text-muted">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                    {item.size ? ` · ${item.size}` : ""}
                    {item.scent ? ` · ${item.scent}` : ""}
                  </p>
                </li>
              ))}
              {selectedOrder.items.length === 0 && (
                <li className="text-sm text-muted">Nenhum item informado.</li>
              )}
            </ul>

            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm font-semibold text-muted">Total</span>
              <strong className="font-display text-xl text-primary-dark">
                {formatPrice(selectedOrder.total)}
              </strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
