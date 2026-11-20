import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  ArrowLeft,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  ShieldCheck,
} from "lucide-react";

import { auth } from "../../firebase.config";
import { extractList, mapApiProduct } from "../../data/productMapper";
import { productService } from "../../services/productService";
import Logo from "../../components/Logo";
import ThemeToggle from "../../components/ThemeToggle";
import AdminOrdersView from "./AdminOrdersView";
import AdminProductManager from "./AdminProductManager";

const MENU = [
  { id: "overview", label: "Visão geral", Icon: LayoutDashboard },
  { id: "orders", label: "Pedidos", Icon: ClipboardList },
  { id: "products", label: "Produtos", Icon: Package },
];

export function AdminPage() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(undefined);
  const [activeView, setActiveView] = useState("overview");
  const [products, setProducts] = useState([]);
  const [productsStatus, setProductsStatus] = useState("loading");
  const [productsError, setProductsError] = useState("");

  useEffect(() => onAuthStateChanged(auth, setAdminUser), []);

  async function loadProducts() {
    setProductsStatus("loading");
    setProductsError("");
    try {
      const data = await productService.findAll({ page: 0, size: 100, sort: "name" });
      setProducts(extractList(data).map(mapApiProduct));
      setProductsStatus("ready");
    } catch (error) {
      const status = error.response?.status;
      setProductsStatus("error");
      setProductsError(
        status === 401 || status === 403
          ? "Sua sessão não tem permissão para listar os produtos."
          : "Não foi possível carregar os produtos."
      );
    }
  }

  useEffect(() => {
    if (adminUser) loadProducts();
  }, [adminUser]);

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  if (adminUser === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <p className="text-sm text-muted">Verificando acesso administrativo...</p>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <>
        <div className="flex min-h-screen items-center justify-center bg-page px-5">
          <div className="w-full max-w-md rounded-brand border border-line bg-surface p-8 text-center shadow-brand-md">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary-dark">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="m-0 font-display text-2xl text-primary-dark">
              Acesso restrito
            </h1>
            <p className="mb-6 mt-2 text-sm text-muted">
              Entre com uma conta de administrador para gerenciar pedidos e produtos.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate("/login", { state: { openAdmin: true } })}
                className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
              >
                Entrar como administrador
              </button>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-primary-dark transition hover:bg-primary-light"
              >
                Voltar ao catálogo
              </button>
            </div>
          </div>
        </div>
        <ThemeToggle />
      </>
    );
  }

  const activeLabel = MENU.find((item) => item.id === activeView)?.label;

  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/home")}
              aria-label="Voltar ao catálogo"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary-dark transition hover:bg-line"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Logo />
            <span className="hidden border-l border-line pl-3 font-display text-sm text-muted sm:inline">
              Painel administrativo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted md:inline">{adminUser.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-2 text-sm font-semibold text-primary-dark transition hover:bg-line"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted">
            Administração
          </p>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col">
            {MENU.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveView(id)}
                className={`flex shrink-0 items-center gap-3 rounded-brand-sm px-4 py-3 text-left font-body text-sm font-semibold transition ${
                  activeView === id
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-primary-light hover:text-primary-dark"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-muted">
                FiecLab / Administração
              </p>
              <h1 className="m-0 mt-1 font-display text-3xl text-primary-dark">
                {activeLabel}
              </h1>
            </div>
            {activeView !== "overview" && (
              <button
                type="button"
                onClick={() => navigate("/create-product")}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark"
              >
                <Plus className="h-4 w-4" /> Criar produto
              </button>
            )}
          </div>

          {activeView === "overview" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveView("products")}
                className="rounded-brand border border-line bg-surface p-6 text-left shadow-brand-sm transition hover:-translate-y-0.5 hover:border-primary-light hover:shadow-brand-md"
              >
                <Package className="mb-4 h-7 w-7 text-primary" />
                <strong className="block font-display text-xl text-ink">
                  {productsStatus === "ready" ? `${products.length} produtos` : "Produtos"}
                </strong>
                <span className="mt-1 block text-sm text-muted">
                  Edite preços, estoque, categoria e disponibilidade.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("orders")}
                className="rounded-brand border border-line bg-surface p-6 text-left shadow-brand-sm transition hover:-translate-y-0.5 hover:border-primary-light hover:shadow-brand-md"
              >
                <ClipboardList className="mb-4 h-7 w-7 text-primary" />
                <strong className="block font-display text-xl text-ink">Pedidos</strong>
                <span className="mt-1 block text-sm text-muted">
                  Consulte os pedidos registrados e atualize o status de cada um.
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/create-product")}
                className="rounded-brand border border-dashed border-primary/40 bg-primary-light/40 p-6 text-left transition hover:-translate-y-0.5 hover:bg-primary-light"
              >
                <Plus className="mb-4 h-7 w-7 text-primary-dark" />
                <strong className="block font-display text-xl text-primary-dark">
                  Criar novo produto
                </strong>
                <span className="mt-1 block text-sm text-muted">
                  Abra a página de cadastro para publicar um item no catálogo.
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/home")}
                className="rounded-brand border border-line bg-surface p-6 text-left shadow-brand-sm transition hover:-translate-y-0.5 hover:border-primary-light"
              >
                <ArrowLeft className="mb-4 h-7 w-7 text-muted" />
                <strong className="block font-display text-xl text-ink">
                  Ver loja
                </strong>
                <span className="mt-1 block text-sm text-muted">
                  Confira como o catálogo aparece para os clientes.
                </span>
              </button>
            </div>
          )}

          {activeView === "orders" && <AdminOrdersView />}

          {activeView === "products" && (
            <>
              {productsStatus === "loading" && (
                <p className="py-12 text-center text-sm text-muted">
                  Carregando produtos...
                </p>
              )}
              {productsStatus === "error" && (
                <div className="rounded-brand border border-danger/30 bg-danger/10 p-8 text-center">
                  <p className="m-0 text-sm font-semibold text-danger">{productsError}</p>
                  <button
                    type="button"
                    onClick={loadProducts}
                    className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                  >
                    Tentar novamente
                  </button>
                </div>
              )}
              {productsStatus === "ready" && (
                <AdminProductManager
                  products={products}
                  onProductsChange={setProducts}
                />
              )}
            </>
          )}
        </main>
      </div>

      <ThemeToggle />
    </div>
  );
}

export default AdminPage;
