import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ArrowLeft, ClipboardList, LogOut, Package } from "lucide-react";

import { auth } from "../../firebase.config";
import Logo from "../../components/Logo";
import ThemeToggle from "../../components/ThemeToggle";

// abas da página; o conteúdo de cada uma entra nas próximas etapas
const TABS = [
  {
    id: "products",
    label: "Produtos",
    Icon: Package,
    soon: "Aqui vai a gestão de produtos: lista ampla, busca, edição e estoque.",
  },
  {
    id: "orders",
    label: "Pedidos",
    Icon: ClipboardList,
    soon: "Aqui vai a lista de pedidos, com detalhes e status.",
  },
];

// Descobre quem está logado como admin (Firebase).
// loading = true enquanto o Firebase ainda está verificando a sessão.
// ATENÇÃO: esta checagem é só visual (esconde a tela). A segurança de verdade
// precisa ser feita no backend, que deve recusar quem não for admin.
function useAdminUser() {
  const [state, setState] = useState({ user: null, loading: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      setState({ user, loading: false })
    );
    return unsubscribe;
  }, []);

  return state;
}

export function AdminPage() {
  const navigate = useNavigate();
  const { user, loading } = useAdminUser();
  const [activeTab, setActiveTab] = useState("products");

  async function handleLogout() {
    await signOut(auth);
    navigate("/home");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Verificando acesso...
      </div>
    );
  }

  // sem login de admin: volta para a loja e abre a janela de login do admin
  if (!user) {
    return <Navigate to="/home" replace state={{ openAdmin: true }} />;
  }

  const current = TABS.find((tab) => tab.id === activeTab);

  return (
    <div className="min-h-screen">
      {/* barra superior */}
      <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden rounded-full bg-primary-light px-3 py-1 font-body text-xs font-bold uppercase tracking-wide text-primary-dark sm:inline">
              Administração
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden text-sm text-muted md:inline">{user.email}</span>

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-primary-light px-3.5 py-2 font-body text-sm font-semibold text-primary-dark transition hover:bg-line"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar à loja</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-primary px-3.5 py-2 font-body text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-5 py-8">
        <h1 className="m-0 mb-1 font-display text-2xl font-bold text-primary-dark sm:text-[28px]">
          Painel do administrador
        </h1>
        <p className="m-0 mb-6 text-sm text-muted">
          Gerencie os produtos e acompanhe os pedidos da loja.
        </p>

        {/* abas */}
        <div role="tablist" aria-label="Seções da administração" className="mb-6 flex gap-2">
          {TABS.map(({ id, label, Icon }) => {
            const selected = id === activeTab;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(id)}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 font-body text-sm font-semibold transition ${
                  selected
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-surface text-primary-dark hover:bg-primary-light"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>

        {/* conteúdo da aba (por enquanto, só um aviso) */}
        <section
          role="tabpanel"
          className="rounded-brand border border-line bg-surface p-8 text-center shadow-brand-md"
        >
          <current.Icon className="mx-auto mb-3 h-10 w-10 text-primary" strokeWidth={1.5} />
          <h2 className="m-0 mb-1 font-display text-xl font-bold text-ink">{current.label}</h2>
          <p className="m-0 text-sm text-muted">{current.soon}</p>
        </section>
      </main>

      <ThemeToggle />
    </div>
  );
}

export default AdminPage;
