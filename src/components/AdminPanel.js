import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, ClipboardList, Package } from "lucide-react";

import AdminProductsList from "./AdminProductsList";

const MENU = [
  {
    id: "orders",
    label: "Pedidos",
    description: "Acompanhe os pedidos realizados",
    Icon: ClipboardList,
  },
  {
    id: "products",
    label: "Produtos",
    description: "Edite informações, preços e estoque",
    Icon: Package,
  },
];

function AdminPanel({
  isOpen,
  onClose,
  products,
  categories,
  onSaveProduct,
  onSaveStock,
}) {
  const [view, setView] = useState("menu");

  // ao fechar o painel, volta para o menu na próxima abertura
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setView("menu"), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const isMenu = view === "menu";
  const current = MENU.find((item) => item.id === view);

  return (
    <>
      <div
        className={`fixed inset-0 z-[34] bg-[#0b2822]/35 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        aria-label="Painel do administrador"
        className={`fixed top-0 z-[35] flex h-full w-full flex-col bg-surface px-6 py-7 shadow-sidebar transition-[right] duration-300 ${
          isMenu ? "sm:w-80" : "sm:w-[680px]"
        } ${isOpen ? "right-0" : "-right-full sm:-right-[720px]"}`}
      >
        <div className="mb-5 flex items-center gap-2.5">
          {!isMenu && (
            <button
              type="button"
              onClick={() => setView("menu")}
              className="flex items-center gap-1.5 rounded-full bg-primary-light px-3.5 py-2 font-body text-sm font-semibold text-primary-dark transition hover:bg-line"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-primary-light px-3.5 py-2 font-body text-sm font-semibold text-primary-dark transition hover:bg-line"
          >
            Fechar
          </button>
        </div>

        {isMenu && (
          <>
            <h2 className="mb-[18px] font-display text-primary-dark">
              Painel do administrador
            </h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {MENU.map(({ id, label, description, Icon }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setView(id)}
                    className="flex w-full cursor-pointer items-center gap-3.5 rounded-brand border border-line bg-surface p-4 text-left font-[inherit] transition hover:-translate-y-0.5 hover:border-primary-light hover:shadow-brand-md"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary-dark">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="flex flex-1 flex-col gap-0.5">
                      <strong className="font-display text-[15px] text-ink">
                        {label}
                      </strong>
                      <span className="text-xs text-muted">{description}</span>
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {view === "products" && (
          <>
            <h2 className="mb-4 font-display text-primary-dark">
              {current.label}
            </h2>
            <AdminProductsList
              products={products}
              categories={categories}
              onSaveProduct={onSaveProduct}
              onSaveStock={onSaveStock}
            />
          </>
        )}

        {view === "orders" && (
          <>
            <h2 className="mb-4 font-display text-primary-dark">
              {current.label}
            </h2>
            <p className="text-sm text-muted">
              A tela de pedidos será implementada em breve.
            </p>
          </>
        )}
      </aside>
    </>
  );
}

export default AdminPanel;
